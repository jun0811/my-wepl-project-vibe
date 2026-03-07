-- ============================================
-- Security Hardening Migration
-- ============================================

-- 1. Find couple by code (server-side lookup, no bulk fetch)
CREATE OR REPLACE FUNCTION find_couple_by_code(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_couple_id UUID;
BEGIN
  SELECT id INTO v_couple_id
  FROM couples
  WHERE SUBSTRING(id::TEXT, 1, 8) = LOWER(p_code)
  LIMIT 1;

  RETURN v_couple_id;
END;
$$;

-- 2. Join partner couple atomically
CREATE OR REPLACE FUNCTION join_partner_couple(p_target_couple_id UUID)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_old_couple_id UUID;
  v_member_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get current couple_id
  SELECT couple_id INTO v_old_couple_id
  FROM profiles WHERE id = v_user_id;

  -- Prevent joining own couple
  IF v_old_couple_id = p_target_couple_id THEN
    RAISE EXCEPTION 'Cannot join own couple';
  END IF;

  -- Verify target couple exists
  IF NOT EXISTS (SELECT 1 FROM couples WHERE id = p_target_couple_id) THEN
    RAISE EXCEPTION 'Target couple not found';
  END IF;

  -- Update profile to new couple
  UPDATE profiles SET couple_id = p_target_couple_id WHERE id = v_user_id;

  -- Move user's expenses to new couple
  IF v_old_couple_id IS NOT NULL THEN
    UPDATE expenses SET couple_id = p_target_couple_id
    WHERE couple_id = v_old_couple_id AND created_by = v_user_id;

    UPDATE schedules SET couple_id = p_target_couple_id
    WHERE couple_id = v_old_couple_id;

    -- Check if old couple has remaining members
    SELECT COUNT(*) INTO v_member_count
    FROM profiles WHERE couple_id = v_old_couple_id;

    IF v_member_count = 0 THEN
      DELETE FROM categories WHERE couple_id = v_old_couple_id;
      DELETE FROM couples WHERE id = v_old_couple_id;
    END IF;
  END IF;
END;
$$;

-- 3. Delete user account (proper cleanup)
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_couple_id UUID;
  v_member_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get couple_id before deleting profile
  SELECT couple_id INTO v_couple_id
  FROM profiles WHERE id = v_user_id;

  -- Delete user's expenses
  DELETE FROM expenses WHERE created_by = v_user_id;

  -- Delete profile (triggers CASCADE from auth.users FK)
  DELETE FROM profiles WHERE id = v_user_id;

  -- Clean up orphaned couple
  IF v_couple_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_member_count
    FROM profiles WHERE couple_id = v_couple_id;

    IF v_member_count = 0 THEN
      DELETE FROM schedules WHERE couple_id = v_couple_id;
      DELETE FROM categories WHERE couple_id = v_couple_id;
      DELETE FROM couples WHERE id = v_couple_id;
    END IF;
  END IF;

  -- Delete auth user
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

-- 4. RLS: Prevent couple data access during onboarding (NULL couple_id)
-- The existing policies use:
--   couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
-- When couple_id is NULL, this returns NULL which doesn't match any row → SAFE
-- But add explicit couple SELECT policy to prevent enumeration

-- Drop and recreate couples SELECT policy to be more restrictive
DROP POLICY IF EXISTS "Couple members can view" ON couples;
CREATE POLICY "Couple members can view"
  ON couples FOR SELECT
  USING (
    id IN (
      SELECT couple_id FROM profiles
      WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  );

-- 5. Restrict anonymous_stats insert to trigger only (no direct client insert)
CREATE POLICY "No direct insert on stats"
  ON anonymous_stats FOR INSERT
  WITH CHECK (false);
-- The trigger uses SECURITY DEFINER so it bypasses RLS

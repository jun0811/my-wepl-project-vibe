-- ============================================
-- Wepl Database Schema
-- 결혼 비용 인사이트 플랫폼
-- ============================================

-- 1. Couples (커플 - 데이터의 기본 단위)
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_date DATE,
  wedding_time TIME,
  wedding_hall TEXT,
  region TEXT,
  total_budget BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Profiles (사용자 프로필 - Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
  nickname TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('bride', 'groom')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Categories (예산 카테고리 - 커플당 7개 기본 + 커스텀)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  budget_amount BIGINT NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_couple ON categories(couple_id);

-- 4. Expenses (지출 항목)
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  memo TEXT,
  date DATE,
  tags TEXT[] DEFAULT '{}',
  is_paid BOOLEAN NOT NULL DEFAULT false,
  vendor_name TEXT,
  vendor_rating SMALLINT CHECK (vendor_rating BETWEEN 1 AND 5),
  price_feeling TEXT CHECK (price_feeling IN ('cheap', 'fair', 'expensive')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_couple ON expenses(couple_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);

-- 5. Schedules (일정 - 독립 엔티티)
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  memo TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_schedules_couple ON schedules(couple_id);
CREATE INDEX idx_schedules_date ON schedules(date);

-- 6. Anonymous Stats (익명 통계 수집 - BM 핵심)
CREATE TABLE anonymous_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT,
  category_name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  vendor_type TEXT,
  tags TEXT[] DEFAULT '{}',
  wedding_year INTEGER,
  wedding_month INTEGER,
  price_feeling TEXT CHECK (price_feeling IN ('cheap', 'fair', 'expensive')),
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stats_region ON anonymous_stats(region);
CREATE INDEX idx_stats_category ON anonymous_stats(category_name);
CREATE INDEX idx_stats_year_month ON anonymous_stats(wedding_year, wedding_month);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_stats ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Couples: members can access their couple data
CREATE POLICY "Couple members can view"
  ON couples FOR SELECT
  USING (
    id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Couple members can update"
  ON couples FOR UPDATE
  USING (
    id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authenticated users can create couples"
  ON couples FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Categories: couple members only
CREATE POLICY "Couple members can manage categories"
  ON categories FOR ALL
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- Expenses: couple members only
CREATE POLICY "Couple members can manage expenses"
  ON expenses FOR ALL
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- Schedules: couple members only
CREATE POLICY "Couple members can manage schedules"
  ON schedules FOR ALL
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- Anonymous stats: readable by all authenticated users (aggregated data)
CREATE POLICY "Authenticated users can read stats"
  ON anonymous_stats FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- Triggers
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER couples_updated_at
  BEFORE UPDATE ON couples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-collect anonymous stats when expense is marked as paid
CREATE OR REPLACE FUNCTION collect_anonymous_stat()
RETURNS TRIGGER AS $$
DECLARE
  v_region TEXT;
  v_category_name TEXT;
  v_wedding_date DATE;
BEGIN
  -- Only collect when expense is marked as paid
  IF NEW.is_paid = true AND (OLD.is_paid = false OR OLD IS NULL) THEN
    -- Get couple info
    SELECT c.region, c.wedding_date
    INTO v_region, v_wedding_date
    FROM couples c
    WHERE c.id = NEW.couple_id;

    -- Get category name
    SELECT cat.name
    INTO v_category_name
    FROM categories cat
    WHERE cat.id = NEW.category_id;

    -- Insert anonymized stat (no couple_id, no user_id)
    INSERT INTO anonymous_stats (
      region, category_name, amount, vendor_type, tags,
      wedding_year, wedding_month, price_feeling
    ) VALUES (
      v_region,
      v_category_name,
      NEW.amount,
      COALESCE(NEW.vendor_name, NULL),
      NEW.tags,
      EXTRACT(YEAR FROM v_wedding_date)::INTEGER,
      EXTRACT(MONTH FROM v_wedding_date)::INTEGER,
      NEW.price_feeling
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER expense_paid_collect_stat
  AFTER INSERT OR UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION collect_anonymous_stat();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Views for Statistics
-- ============================================

-- Category averages by region (for Explore tab)
CREATE OR REPLACE VIEW category_averages AS
SELECT
  region,
  category_name,
  COUNT(*) as data_count,
  ROUND(AVG(amount)) as avg_amount,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount)) as median_amount,
  MIN(amount) as min_amount,
  MAX(amount) as max_amount,
  ROUND(PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY amount)) as p25_amount,
  ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY amount)) as p75_amount
FROM anonymous_stats
GROUP BY region, category_name
HAVING COUNT(*) >= 10;  -- k-anonymity: minimum 10 data points

import { createClient } from "@/shared/lib/supabase";
import type { Schedule, InsertSchedule, UpdateSchedule } from "@/shared/types";

export async function getSchedules(coupleId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("schedules")
    .select()
    .eq("couple_id", coupleId)
    .order("date", { ascending: true });

  if (error) throw error;
  return data as Schedule[];
}

export async function createSchedule(schedule: InsertSchedule) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("schedules")
    .insert(schedule)
    .select()
    .single<Schedule>();

  if (error) throw error;
  return data;
}

export async function updateSchedule(id: string, updates: UpdateSchedule) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("schedules")
    .update(updates)
    .eq("id", id)
    .select()
    .single<Schedule>();

  if (error) throw error;
  return data;
}

export async function deleteSchedule(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("schedules")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleScheduleComplete(id: string, isCompleted: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("schedules")
    .update({ is_completed: isCompleted })
    .eq("id", id)
    .select()
    .single<Schedule>();

  if (error) throw error;
  return data;
}

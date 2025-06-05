import { supabase } from "./supabase";

export async function getMatchingTimeSlots() {
  const { data, error } = await supabase.rpc("get_common_time_slots");

  if (error) throw new Error(error.message);

  return data;
}

export async function getVotesMap(): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc("get_votes_map");

  if (error) throw new Error(error.message);

  const map = new Map<string, number>();
  interface VoteRow {
    day_of_week: string;
    start_hour: number;
    end_hour: number;
    vote_count: number;
  }

  (data as VoteRow[]).forEach((row: VoteRow) => {
    const key = `${row.day_of_week}-${row.start_hour}-${row.end_hour}`;
    map.set(key, row.vote_count);
  });

  return map;
}

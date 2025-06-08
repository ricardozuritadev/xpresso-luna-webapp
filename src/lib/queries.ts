import { supabase } from "./supabase";
import { flatHours } from "@/data/week-days.mock";

export async function getMatchingTimeSlots() {
  const { data, error } = await supabase
    .from("availability")
    .select("user_id, day_of_week, start_hour, end_hour");

  if (error) throw new Error(error.message);
  if (!data) return [];

  type Slot = {
    user_id: string;
    day_of_week: string;
    start_hour: string;
    end_hour: string;
  };

  const userSlots = new Map<string, Map<string, Set<string>>>();

  for (const row of data as Slot[]) {
    const { user_id, day_of_week, start_hour, end_hour } = row;

    const startIdx = flatHours.indexOf(start_hour);
    const endIdx = flatHours.indexOf(end_hour);

    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) continue;

    if (!userSlots.has(user_id)) userSlots.set(user_id, new Map());
    const days = userSlots.get(user_id)!;

    if (!days.has(day_of_week)) days.set(day_of_week, new Set());
    const hours = days.get(day_of_week)!;

    for (let i = startIdx; i < endIdx; i++) {
      hours.add(flatHours[i]);
    }
  }

  const result: Slot[] = [];

  const daysOfWeek = new Set<string>();
  for (const user of userSlots.values()) {
    for (const day of user.keys()) daysOfWeek.add(day);
  }

  for (const day of daysOfWeek) {
    const hourSets: Set<string>[] = [];

    for (const user of userSlots.values()) {
      if (user.has(day)) {
        hourSets.push(user.get(day)!);
      }
    }

    if (hourSets.length < 2) continue;

    const intersection = flatHours.filter((h) =>
      hourSets.every((set) => set.has(h)),
    );

    // Agrupar bloques consecutivos
    let i = 0;
    while (i < intersection.length) {
      let j = i + 1;

      while (
        j < intersection.length &&
        flatHours.indexOf(intersection[j]) ===
          flatHours.indexOf(intersection[j - 1]) + 1
      ) {
        j++;
      }

      const endIndex = flatHours.indexOf(intersection[j - 1]) + 1;
      const end = flatHours[endIndex];

      if (end) {
        result.push({
          user_id: "MATCHED",
          day_of_week: day,
          start_hour: intersection[i],
          end_hour: end,
        });
      }

      i = j;
    }
  }

  return result;
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

export async function getNextRehearsal() {
  const { data, error } = await supabase
    .from("rehearsals")
    .select("*")
    .eq("singleton", true)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error al obtener repaso:", error.message);
    return null;
  }

  return data;
}

export async function setNextRehearsal(
  date: string,
  start: string,
  end: string,
  lastUpdatedAt?: string,
) {
  const { data } = await supabase
    .from("rehearsals")
    .select("updated_at")
    .eq("singleton", true)
    .single();

  if (data && lastUpdatedAt && data.updated_at !== lastUpdatedAt) {
    throw new Error("conflict");
  }

  const { error: upsertError } = await supabase.from("rehearsals").upsert(
    [
      {
        singleton: true,
        date,
        start_time: start,
        end_time: end,
        updated_at: new Date().toISOString(),
      },
    ],
    { onConflict: "singleton" },
  );

  if (upsertError) {
    console.error("Error guardando repaso:", upsertError.message);
    throw new Error("insert_failed");
  }

  return true;
}

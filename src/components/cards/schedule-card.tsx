"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "../ui/checkbox";

type ScheduleCardProps = {
  day: string;
  hours: string[];
  votes: Map<string, number>;
  userId?: string;
};

export default function ScheduleCard({
  day,
  hours,
  votes,
  userId,
}: ScheduleCardProps) {
  const [voteMap, setVoteMap] = useState<Map<string, number>>(new Map(votes));

  const toggleVote = async (day: string, start: string, end: string) => {
    if (!userId) return;

    const key = `${day}-${start}-${end}`;
    const currentVotes = voteMap.get(key) || 0;

    // Verificamos si ya ha votado
    const { data: existing, error } = await supabase
      .from("votes")
      .select("id")
      .eq("user_id", userId)
      .eq("day_of_week", day)
      .eq("start_hour", start)
      .eq("end_hour", end)
      .maybeSingle();

    if (error) {
      console.error("Error consultando voto:", error.message);
      return;
    }

    if (existing) {
      // Ya existe: eliminar
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("id", existing.id);

      if (!deleteError) {
        voteMap.set(key, Math.max(0, currentVotes - 1));
        setVoteMap(new Map(voteMap));
      }
    } else {
      // No existe: insertar
      const { error: insertError } = await supabase.from("votes").insert({
        user_id: userId,
        day_of_week: day,
        start_hour: start,
        end_hour: end,
      });

      if (!insertError) {
        voteMap.set(key, currentVotes + 1);
        setVoteMap(new Map(voteMap));
      }
    }
  };

  if (!hours || hours.length === 0) return null;

  return (
    <div className="flex flex-col justify-between">
      <div>
        <h2 className="mb-2 text-lg font-bold">{day}</h2>

        <div className="border-ring flex flex-col gap-4 rounded-lg border p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
          {hours.map((hour, index) => {
            const [start, end] = hour.split(" - ");
            const key = `${day}-${start}-${end}`;
            const voteCount = voteMap.get(key) ?? 0;

            return (
              <div key={index} className="flex items-center justify-between">
                <p className="text-chart-3">{hour}</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="border-chart-2 data-[state=checked]:border-chart-2 h-6 w-6 border"
                    onClick={() => toggleVote(day, start, end)}
                  />
                  <span className="text-muted-foreground text-sm">
                    x{voteCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

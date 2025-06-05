"use client";

import { getCurrentWeekRange } from "@/lib/helpers";

import { Button } from "@/components/ui/button";
import ScheduleCard from "@/components/cards/schedule-card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getMatchingTimeSlots, getVotesMap } from "@/lib/queries";
import { useUser } from "@/hooks/use-user";

export default function Home() {
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [votes, setVotes] = useState<Map<string, number>>(new Map());

  const { user } = useUser();

  // Sinc user profile with Supabase
  // This ensures that the user profile is created in the "profiles" table
  useEffect(() => {
    const syncProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { id, user_metadata } = user;
      const full_name =
        user_metadata.full_name || user_metadata.name || "Sin nombre";
      const avatar_url = user_metadata.avatar_url || "";

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", id)
        .single();

      if (!existing) {
        await supabase.from("profiles").insert({ id, full_name, avatar_url });
      }
    };

    syncProfile();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const slots = await getMatchingTimeSlots();
        const votesMap = await getVotesMap();

        // Agrupar por día
        const grouped: Record<string, string[]> = {};
        interface Slot {
          day_of_week: string;
          start_hour: string;
          end_hour: string;
        }

        (slots as Slot[]).forEach((slot: Slot) => {
          const hourLabel: string = `${slot.start_hour} - ${slot.end_hour}`;
          if (!grouped[slot.day_of_week]) grouped[slot.day_of_week] = [];
          grouped[slot.day_of_week].push(hourLabel);
        });

        setSchedule(grouped);
        setVotes(votesMap);
      } catch (err) {
        console.error("Error al cargar horarios:", err);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="container mx-auto h-[calc(100vh-80px)] overflow-y-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-black">Esta semana</h1>
        <span>Horarios disponibles del {getCurrentWeekRange()}</span>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(schedule).map(([day, hours]) => (
          <ScheduleCard
            key={day}
            day={day}
            hours={hours}
            votes={votes}
            userId={user?.id}
          />
        ))}
      </section>

      <Button size="lg" className="bg-chart-2 mb-4 w-full font-bold">
        Modificar mis horarios
      </Button>
    </div>
  );
}

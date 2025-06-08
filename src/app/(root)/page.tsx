"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import { convertTo12Hour, getCurrentWeekRange } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import ScheduleCard from "@/components/cards/schedule-card";
import { getMatchingTimeSlots, getVotesMap } from "@/lib/queries";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NextRehearsalPicker } from "@/components/forms/next-rehersal-picker";

export default function Home() {
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [votes, setVotes] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

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

        const grouped: Record<string, string[]> = {};
        interface Slot {
          day_of_week: string;
          start_hour: string;
          end_hour: string;
        }

        (slots as Slot[]).forEach((slot: Slot) => {
          const hourLabel: string = `${convertTo12Hour(slot.start_hour)} - ${convertTo12Hour(slot.end_hour)}`;
          if (!grouped[slot.day_of_week]) grouped[slot.day_of_week] = [];
          grouped[slot.day_of_week].push(hourLabel);
        });

        setSchedule(grouped);
        setVotes(votesMap);
      } catch (err) {
        console.error("Error al cargar horarios:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="container mx-auto flex min-h-screen flex-col px-4 pt-8 pb-24">
      <section className="mb-8">
        <h1 className="text-3xl font-black">Esta semana</h1>
      </section>

      <NextRehearsalPicker />

      <p className="mb-4">
        Horarios que coincidimos del {getCurrentWeekRange()}:
      </p>

      {isLoading ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
          <p className="mb-4">Cargando horarios disponibles...</p>
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : (
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
      )}

      <Button
        size="lg"
        className="bg-chart-2 mb-4 w-full font-bold"
        onClick={() => (window.location.href = "/schedules")}
      >
        Modificar mis horarios
      </Button>
    </div>
  );
}

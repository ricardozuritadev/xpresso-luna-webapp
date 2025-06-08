"use client";

import SchedulePick from "@/components/cards/schedule-pick";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DayOfWeek, defaultAvailability } from "@/types";
import { flatHours } from "@/data/week-days.mock";
import { Loader2 } from "lucide-react";

export default function Schedules() {
  const { user } = useUser();
  const [availability, setAvailability] = useState(defaultAvailability);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("availability")
        .select("day_of_week, start_hour, end_hour")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error al cargar disponibilidad:", error.message);
        return;
      }

      const transformed = structuredClone(defaultAvailability);

      data.forEach(({ day_of_week, start_hour, end_hour }) => {
        if (flatHours.includes(start_hour) && flatHours.includes(end_hour)) {
          transformed[day_of_week as DayOfWeek] = {
            start: start_hour,
            end: end_hour,
          };
        }
      });

      setAvailability(transformed);
      setIsLoading(false);
    };

    fetchAvailability();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    for (const [day, { start, end }] of Object.entries(availability)) {
      if (start && !end) {
        toast.error(`Selecciona la hora de fin para ${day}.`);
        return;
      }

      if (!start && end) {
        toast.error(`Selecciona la hora de inicio para ${day}.`);
        return;
      }

      if (start && end && flatHours.indexOf(start) >= flatHours.indexOf(end)) {
        toast.error(
          `La hora de inicio debe ser menor que la de fin en ${day}.`,
        );
        return;
      }
    }

    const updates = Object.entries(availability)
      .filter(([, { start, end }]) => start && end)
      .map(([day, { start, end }]) => ({
        user_id: user.id,
        day_of_week: day,
        start_hour: start,
        end_hour: end,
      }));

    // Limpiar datos previos
    const { error: deleteError } = await supabase
      .from("availability")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      toast.error("Error al guardar disponibilidad.");
      console.error(deleteError.message);
      return;
    }

    if (updates.length > 0) {
      const { error: insertError } = await supabase
        .from("availability")
        .insert(updates);

      if (insertError) {
        toast.error("Error al guardar disponibilidad.");
        console.error(insertError.message);
      } else {
        toast.success("Disponibilidad guardada con éxito.");
      }
    } else {
      toast.success("No seleccionaste horarios. Disponibilidad vacía.");
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col px-4 pt-8 pb-24">
      <h2 className="mb-4 text-2xl font-black">Disponibilidad</h2>

      {isLoading ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
          <p className="mb-4">Cargando horarios...</p>
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">
            Si no estás disponible en un día, simplemente deja las horas en
            blanco.
          </p>
          <SchedulePick
            availability={availability}
            setAvailability={setAvailability}
          />
        </>
      )}

      <Button
        size="lg"
        className="bg-chart-2 mb-4 w-full font-bold"
        onClick={handleSave}
      >
        Guardar
      </Button>
    </div>
  );
}

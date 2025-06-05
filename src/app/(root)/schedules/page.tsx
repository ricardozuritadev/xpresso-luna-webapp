"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SchedulePick from "@/components/cards/schedule-pick";

type DayAvailability = {
  start: string;
  end: string;
};

const defaultAvailability: Record<string, DayAvailability> = {
  lunes: { start: "", end: "" },
  martes: { start: "", end: "" },
  miércoles: { start: "", end: "" },
  jueves: { start: "", end: "" },
  viernes: { start: "", end: "" },
  sábado: { start: "", end: "" },
  domingo: { start: "", end: "" },
};

export default function SchedulePage() {
  const { user } = useUser();
  const [availability, setAvailability] = useState(defaultAvailability);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAvailability = async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        toast.error("Error al cargar horarios.");
        return;
      }

      const mapped = { ...defaultAvailability };

      data?.forEach((slot) => {
        const day = slot.day_of_week.toLowerCase();
        if (mapped[day]) {
          mapped[day] = {
            start: slot.start_hour.slice(0, 5),
            end: slot.end_hour.slice(0, 5),
          };
        }
      });

      setAvailability(mapped);
    };

    fetchAvailability();
  }, [user?.id]);

  const handleChange = (day: string, field: "start" | "end", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    for (const [day, { start, end }] of Object.entries(availability)) {
      const startEmpty = !start;
      const endEmpty = !end;

      if ((startEmpty && !endEmpty) || (!startEmpty && endEmpty)) {
        toast.error(`Selecciona inicio y fin para el día "${day}"`);
        return;
      }

      if (!startEmpty && !endEmpty && start >= end) {
        toast.error(
          `La hora de inicio debe ser menor que la de fin en "${day}"`,
        );
        return;
      }
    }

    // Eliminar horarios anteriores
    await supabase.from("availability").delete().eq("user_id", user.id);

    // Insertar nuevos
    const toInsert = Object.entries(availability)
      .filter(([, { start, end }]) => start && end)
      .map(([day, { start, end }]) => ({
        user_id: user.id,
        day_of_week: day,
        start_hour: start,
        end_hour: end,
      }));

    if (toInsert.length > 0) {
      const { error } = await supabase.from("availability").insert(toInsert);
      if (error) {
        toast.error("Error al guardar disponibilidad.");
        console.error(error.message);
      } else {
        toast.success("Disponibilidad guardada con éxito.");
      }
    } else {
      toast.info("No seleccionaste ningún horario.");
    }
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto px-4 py-8">
      <h2 className="mb-8 text-2xl font-black">
        Elige tus horarios disponibles
      </h2>

      <SchedulePick availability={availability} onChange={handleChange} />

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

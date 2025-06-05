"use client";

import { weekDays, timeSlots } from "@/data/week-days.mock";
import { cn } from "@/lib/utils";

type DayAvailability = {
  start: string;
  end: string;
};

type SchedulePickProps = {
  availability: Record<string, DayAvailability>;
  onChange: (day: string, field: "start" | "end", value: string) => void;
};

// Función para convertir "HH:MM" a minutos totales
const toMinutes = (time: string) => {
  const [hour, min] = time.split(":").map(Number);
  return hour * 60 + min;
};

const startHours = [...new Set(timeSlots.map((slot) => slot.split(" - ")[0]))];
const endHours = [...new Set(timeSlots.map((slot) => slot.split(" - ")[1]))];

export default function SchedulePick({
  availability,
  onChange,
}: SchedulePickProps) {
  return (
    <section className="mb-8 space-y-8 p-4">
      {weekDays.map((day) => {
        const start = availability[day]?.start || "";
        const end = availability[day]?.end || "";

        const filteredEndHours = endHours.filter((h) =>
          !start ? true : toMinutes(h) > toMinutes(start),
        );

        return (
          <div key={day} className="flex items-center justify-between gap-4">
            <label className="w-24 font-medium capitalize">{day}</label>

            <div className="flex flex-1 items-center gap-2">
              {/* SELECT INICIO */}
              <select
                value={start}
                onChange={(e) => {
                  const newStart = e.target.value;
                  if (end && toMinutes(newStart) >= toMinutes(end)) {
                    onChange(day, "end", "");
                  }
                  onChange(day, "start", newStart);
                }}
                className={cn(
                  "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
                  start && "text-chart-3 font-bold",
                )}
              >
                <option value="">Inicio</option>
                {startHours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              <span className="text-sm">a</span>

              {/* SELECT FIN */}
              <select
                value={end}
                disabled={!start}
                onChange={(e) => {
                  const newEnd = e.target.value;
                  if (start && toMinutes(newEnd) <= toMinutes(start)) {
                    onChange(day, "end", "");
                  } else {
                    onChange(day, "end", newEnd);
                  }
                }}
                className={cn(
                  "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
                  end && "text-chart-3 font-bold",
                  !start && "cursor-not-allowed opacity-50",
                )}
              >
                <option value="">Fin</option>
                {filteredEndHours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </section>
  );
}

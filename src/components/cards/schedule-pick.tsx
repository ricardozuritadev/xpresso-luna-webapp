"use client";

import { cn } from "@/lib/utils";
import { timeSlots, weekDays } from "@/data/week-days.mock";
import { Dispatch, SetStateAction } from "react";
import { DayOfWeek } from "@/types";

type SchedulePickProps = {
  availability: Record<DayOfWeek, { start: string; end: string }>;
  setAvailability: Dispatch<
    SetStateAction<Record<DayOfWeek, { start: string; end: string }>>
  >;
};

export default function SchedulePick({
  availability,
  setAvailability,
}: SchedulePickProps) {
  return (
    <section className="mb-8 space-y-8 p-4">
      {weekDays.map((day) => (
        <DayTimeSelector
          key={day}
          day={day as DayOfWeek}
          availability={availability}
          setAvailability={setAvailability}
        />
      ))}
    </section>
  );
}

type DayTimeSelectorProps = {
  day: DayOfWeek;
  availability: Record<DayOfWeek, { start: string; end: string }>;
  setAvailability: Dispatch<
    SetStateAction<Record<DayOfWeek, { start: string; end: string }>>
  >;
};

function DayTimeSelector({
  day,
  availability,
  setAvailability,
}: DayTimeSelectorProps) {
  const startTime = availability[day].start;
  const endTime = availability[day].end;

  const handleChange = (type: "start" | "end", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label className="w-24 font-medium capitalize">{day}</label>

      <div className="flex flex-1 items-center gap-2">
        <select
          value={startTime}
          onChange={(e) => handleChange("start", e.target.value)}
          className={cn(
            "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
            startTime && "text-chart-3 font-bold",
          )}
        >
          <option value="">Inicio</option>
          {timeSlots.map((slot) => {
            const [start] = slot.split(" - ");
            return (
              <option key={start} value={start}>
                {start}
              </option>
            );
          })}
        </select>

        <span className="text-sm">a</span>

        <select
          value={endTime}
          onChange={(e) => handleChange("end", e.target.value)}
          className={cn(
            "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
            endTime && "text-chart-3 font-bold",
          )}
        >
          <option value="">Fin</option>
          {(() => {
            const startIndex = timeSlots.findIndex((slot) =>
              slot.startsWith(startTime),
            );

            const filteredSlots =
              startIndex !== -1 ? timeSlots.slice(startIndex + 1) : timeSlots;

            return filteredSlots.map((slot) => {
              const [, end] = slot.split(" - ");
              return (
                <option key={end} value={end}>
                  {end}
                </option>
              );
            });
          })()}
        </select>
      </div>
    </div>
  );
}

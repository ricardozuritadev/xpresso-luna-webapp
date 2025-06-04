"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { timeSlots, weekDays } from "@/data/week-days.mock";

export default function SchedulePick() {
  return (
    <section className="mb-8 space-y-8 p-4">
      {weekDays.map((day) => (
        <DayTimeSelector key={day} day={day} timeSlots={timeSlots} />
      ))}
    </section>
  );
}

type DayTimeSelectorProps = {
  day: string;
  timeSlots: string[];
};

function DayTimeSelector({ day, timeSlots }: DayTimeSelectorProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  return (
    <div className="flex items-center justify-between gap-4">
      <label className="w-24 font-medium">{day}</label>

      <div className="flex flex-1 items-center gap-2">
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
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
          onChange={(e) => setEndTime(e.target.value)}
          className={cn(
            "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
            endTime && "text-chart-3 font-bold",
          )}
        >
          <option value="">Fin</option>
          {timeSlots.map((slot) => {
            const [, end] = slot.split(" - ");
            return (
              <option key={end} value={end}>
                {end}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

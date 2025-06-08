"use client";

import { cn } from "@/lib/utils";
import { flatHours, weekDays } from "@/data/week-days.mock";
import { Dispatch, SetStateAction } from "react";
import { DayOfWeek } from "@/types";
import { convertTo12Hour } from "@/lib/helpers";

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

  const startIndex = flatHours.indexOf(startTime);
  const filteredHours =
    startIndex !== -1 ? flatHours.slice(startIndex + 1) : flatHours;

  return (
    <div className="mb-6 flex items-center justify-between">
      <label className="w-24 font-medium capitalize">{day}</label>

      <div className="flex flex-1 items-center gap-2">
        {/* Select de inicio */}
        <select
          value={startTime}
          onChange={(e) => handleChange("start", e.target.value)}
          className={cn(
            "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
            startTime && "text-chart-3 font-bold",
          )}
        >
          <option value="">Inicio</option>
          {flatHours.map((time) => (
            <option key={time} value={time}>
              {convertTo12Hour(time)}
            </option>
          ))}
        </select>

        <span className="text-sm">a</span>

        {/* Select de fin */}
        <select
          value={endTime}
          onChange={(e) => handleChange("end", e.target.value)}
          className={cn(
            "text-muted-foreground w-full rounded-md border border-gray-300 p-2 text-sm",
            endTime && "text-chart-3 font-bold",
          )}
        >
          <option value="">Fin</option>
          {filteredHours.map((time) => (
            <option key={time} value={time}>
              {convertTo12Hour(time)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Pencil, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNextRehearsal, setNextRehearsal } from "@/lib/queries";
import { toast } from "sonner";

export function NextRehearsalPicker() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("19:00");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNextRehearsal();

      if (!data) {
        setNoData(true);
        setIsLoading(false);
        return;
      }

      const parsedDate = new Date(data.date);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }

      setStartTime(data.start_time);
      setEndTime(data.end_time);
      setLastUpdatedAt(data.updated_at);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!date) return;

    try {
      const isoDate = date.toISOString().split("T")[0];

      await setNextRehearsal(isoDate, startTime, endTime, lastUpdatedAt ?? "");
      toast.success("Próximo repaso actualizado");

      setLastUpdatedAt(new Date().toISOString());
      setNoData(false);
      setIsEditing(false);
    } catch (err) {
      console.log("=> err: ", err);
      toast.error(
        "Otro usuario actualizó el repaso. Recarga para ver los cambios.",
      );
    }
  };

  const getFormattedDate = () => {
    if (!date || isNaN(date.getTime())) return "";
    const formatted = format(date, "EEEE d 'de' MMMM", { locale: es });
    return capitalizeFirst(formatted);
  };

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const convertTo12Hour = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr = hours % 12 || 12;
    return `${hr}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  if (isLoading) return null;

  if (noData && !isEditing) {
    return (
      <div className="bg-muted mb-8 flex items-center justify-between rounded-xl p-4 shadow-sm">
        <p className="text-muted-foreground text-lg">
          Aún no hay un repaso programado
        </p>
        <Button onClick={() => setIsEditing(true)} variant="ghost">
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted mb-8 rounded-xl p-4 shadow-sm">
      {!isEditing ? (
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Próximo repaso:
            <br />
            {getFormattedDate()} de {convertTo12Hour(startTime)} a{" "}
            {convertTo12Hour(endTime)}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-primary transition"
          >
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Fecha */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Fecha:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: es })
                  ) : (
                    <span>Elegir</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Hora */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">De:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-md border px-2 py-1"
            />
            <label className="font-semibold">a</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-md border px-2 py-1"
            />
          </div>

          {/* Botón guardar */}
          <div className="flex items-center gap-2">
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      )}
    </div>
  );
}

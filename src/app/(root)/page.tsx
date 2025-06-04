import { auth } from "@/lib/auth";
import { getCurrentWeekRange } from "@/lib/helpers";

import ScheduleCard from "@/components/cards/schedule-card";
import { Button } from "@/components/ui/button";

const weekDays = [
  { day: "Lunes", hours: ["18:00 - 22:00"] },
  { day: "Martes", hours: [] },
  { day: "Miércoles", hours: ["18:00 - 22:00"] },
  { day: "Jueves", hours: ["18:00 - 22:00"] },
  { day: "Viernes", hours: [] },
  { day: "Sábado", hours: ["18:00 - 22:00"] },
  { day: "Domingo", hours: ["18:00 - 22:00"] },
];

export default async function Home() {
  const session = await auth();
  console.log("=> session: ", session);

  return (
    <div className="container mx-auto overflow-auto scroll-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-black">Esta semana</h1>
        <span>Horarios disponibles del {getCurrentWeekRange()}</span>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {weekDays.map((item) => (
          <ScheduleCard key={item.day} day={item.day} hours={item.hours} />
        ))}
      </section>

      <Button size="lg" className="bg-chart-2 w-full">
        Modificar mis horarios
      </Button>
    </div>
  );
}

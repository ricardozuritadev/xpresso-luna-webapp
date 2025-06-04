import { auth } from "@/lib/auth";
import { getCurrentWeekRange } from "@/lib/helpers";
import { userSchedule } from "@/data/week-days.mock";

import { Button } from "@/components/ui/button";
import ScheduleCard from "@/components/cards/schedule-card";

export default async function Home() {
  const session = await auth();
  console.log("=> session: ", session);

  return (
    <div className="container mx-auto h-[calc(100vh-80px)] overflow-y-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-black">Esta semana</h1>
        <span>Horarios disponibles del {getCurrentWeekRange()}</span>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {userSchedule.map((item) => (
          <ScheduleCard key={item.day} day={item.day} hours={item.hours} />
        ))}
      </section>

      <Button size="lg" className="bg-chart-2 mb-4 w-full font-bold">
        Modificar mis horarios
      </Button>
    </div>
  );
}

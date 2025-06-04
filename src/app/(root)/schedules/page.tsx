import SchedulePick from "@/components/cards/schedule-pick";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto px-4 py-8">
      <h2 className="mb-8 text-2xl font-black">
        Elije tus horarios disponibles
      </h2>

      <SchedulePick />

      <Button size="lg" className="bg-chart-2 mb-4 w-full font-bold">
        Guardar
      </Button>
    </div>
  );
}

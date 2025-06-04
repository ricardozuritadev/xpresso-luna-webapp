import { Checkbox } from "../ui/checkbox";

type ScheduleCardProps = {
  day: string;
  hours: string[];
};

export default function ScheduleCard({ day, hours }: ScheduleCardProps) {
  if (!hours || hours.length === 0) return null;

  return (
    <div className="border-chart-2 flex items-center justify-between rounded-lg border p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div>
        <h2 className="text-lg font-bold">{day}</h2>

        <div>{hours}</div>
      </div>

      <div className="flex items-center justify-center">
        <Checkbox className="border-chart-2 h-8 w-8 border-2" />
      </div>
    </div>
  );
}

"use client";

type ScheduleCardProps = {
  day: string;
  hours: string[];
  votes: Map<string, number>;
  userId?: string;
};

export default function ScheduleCard({ day, hours }: ScheduleCardProps) {
  //   const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  //   useEffect(() => {
  //     if (!userId) return;

  //     const loadUserVotes = async () => {
  //       const { data, error } = await supabase
  //         .from("votes")
  //         .select("start_hour, end_hour")
  //         .eq("user_id", userId)
  //         .eq("day_of_week", day);

  //       if (error) {
  //         console.error("Error loading votes", error);
  //         return;
  //       }

  //       const newSet = new Set<string>();
  //       data.forEach((vote) => {
  //         const slot = `${vote.start_hour} - ${vote.end_hour}`;
  //         newSet.add(slot);
  //       });

  //       setSelectedSlots(newSet);
  //     };

  //     loadUserVotes();
  //   }, [userId, day]);

  //   const handleToggle = async (slot: string) => {
  //     if (!userId) {
  //       toast.warning("Debes iniciar sesión para votar");
  //       return;
  //     }

  //     const [start_hour, end_hour] = slot.split(" - ");

  //     const isSelected = selectedSlots.has(slot);
  //     const newSet = new Set(selectedSlots);

  //     if (isSelected) {
  //       newSet.delete(slot);

  //       const { error } = await supabase
  //         .from("votes")
  //         .delete()
  //         .eq("user_id", userId)
  //         .eq("day_of_week", day)
  //         .eq("start_hour", start_hour)
  //         .eq("end_hour", end_hour);

  //       if (error) {
  //         console.error("Error removing vote:", error);
  //         toast.error("Error al quitar voto.");
  //         return;
  //       }
  //     } else {
  //       newSet.add(slot);

  //       const { error } = await supabase.from("votes").insert({
  //         user_id: userId,
  //         day_of_week: day,
  //         start_hour,
  //         end_hour,
  //       });

  //       if (error) {
  //         console.error("Error adding vote:", error);
  //         toast.error("Error al guardar voto.");
  //         return;
  //       }
  //     }

  //     setSelectedSlots(newSet);
  //   };

  if (!hours || hours.length === 0) return null;

  return (
    <div className="flex flex-col justify-between">
      <div>
        <h2 className="mb-2 text-lg font-bold capitalize">{day}</h2>

        <div className="border-ring flex flex-col gap-4 rounded-lg border p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
          {hours.map((hour) => {
            // const count = votes.get(`${day}:${hour}`) ?? 0;
            // const isChecked = selectedSlots.has(hour);

            return (
              <div key={hour} className="flex items-center justify-between">
                <p className="text-chart-3">{hour}</p>

                <div className="flex items-center gap-2">
                  {/* <span className="text-muted-foreground text-sm">
                    x{count}
                  </span> */}
                  {/* <Checkbox
                    className="border-chart-2 data-[state=checked]:border-chart-2 h-6 w-6 border"
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(hour)}
                  /> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

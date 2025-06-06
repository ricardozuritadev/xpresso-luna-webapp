export function getCurrentWeekRange(): string {
  const today = new Date();

  // Calcular el lunes (0 = domingo, 1 = lunes, ..., 6 = sábado)
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  // Calcular el domingo
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };

  const formattedMonday = monday.toLocaleDateString("es-ES", options);
  const formattedSunday = sunday.toLocaleDateString("es-ES", options);

  return `${formattedMonday} al ${formattedSunday}`;
}

export function convertTo24Hour(time: string): string {
  const [timePart, meridiem] = time.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minuteStr}:00`;
}

export function convertTo12Hour(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const meridiem = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${meridiem}`;
}

export function parseTimeToDate(time: string): Date {
  const [timePart, meridiem] = time.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date;
}

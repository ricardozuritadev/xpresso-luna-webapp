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

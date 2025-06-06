export type DayOfWeek =
  | "lunes"
  | "martes"
  | "miércoles"
  | "jueves"
  | "viernes"
  | "sábado"
  | "domingo";

export const defaultAvailability: Record<
  DayOfWeek,
  { start: string; end: string }
> = {
  lunes: { start: "", end: "" },
  martes: { start: "", end: "" },
  miércoles: { start: "", end: "" },
  jueves: { start: "", end: "" },
  viernes: { start: "", end: "" },
  sábado: { start: "", end: "" },
  domingo: { start: "", end: "" },
};

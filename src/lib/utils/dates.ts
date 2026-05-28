import { format, isToday, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "yyyy/MM/dd", { locale: ja });
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "yyyy/MM/dd HH:mm", { locale: ja });
}

export function isDateToday(value: string | Date): boolean {
  const date = typeof value === "string" ? parseISO(value) : value;
  return isToday(date);
}

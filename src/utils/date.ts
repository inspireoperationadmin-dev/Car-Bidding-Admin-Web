import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy", { locale: fr });
}; 


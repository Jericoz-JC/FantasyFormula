import { format, formatDistanceToNow, isPast, isFuture } from "date-fns";

export function formatRaceDate(date: Date): string {
  return format(date, "MMMM d, yyyy 'at' HH:mm");
}

export function formatShortDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatTimeUntil(date: Date): string {
  if (isPast(date)) {
    return "Past";
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isRaceLocked(lockTime: Date): boolean {
  return isPast(lockTime);
}

export function canSubmitRanking(lockTime: Date, status: string): boolean {
  return status === "UPCOMING" && isFuture(lockTime);
}

export function getRaceStatus(date: Date, status: string): {
  label: string;
  color: string;
} {
  if (status === "COMPLETED") {
    return { label: "Completed", color: "gray" };
  }
  
  if (status === "IN_PROGRESS") {
    return { label: "Live", color: "red" };
  }
  
  const now = new Date();
  const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntil < 24) {
    return { label: "Tomorrow", color: "orange" };
  }
  
  if (hoursUntil < 168) {
    return { label: "This Week", color: "blue" };
  }
  
  return { label: "Upcoming", color: "green" };
}


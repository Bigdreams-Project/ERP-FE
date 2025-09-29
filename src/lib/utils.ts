import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export function addHoursToTime(time: string, hours: number): string {
  if (!time) return "";
  const [raw, modifier] = time.split(" ");
  let [hour, minute] = raw.split(":").map(Number);

  if (modifier === "PM" && hour !== 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;

  const date = new Date();
  date.setHours(hour, minute);

  date.setHours(date.getHours() + hours);

  let newHour = date.getHours();
  const newMinute = date.getMinutes();

  const ampm = newHour >= 12 ? "PM" : "AM";
  newHour = newHour % 12 || 12;

  return `${newHour.toString().padStart(2, "0")}:${newMinute
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

export const isWithinRange = (date: Date, start: Date, end: Date) => {
  return date >= start && date <= end;
};

export const includesDate = (
  dateStr: string | null | undefined,
  start: Date,
  end: Date
) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const s = new Date(start);
  const e = new Date(end);
  s.setHours(0, 0, 0, 0);
  e.setHours(23, 59, 59, 999);
  return d >= s && d <= e;
};

export const formatNumber = (n: number) => n.toLocaleString();
export const percent = (num: number, den: number) =>
  den === 0 ? "0%" : `${((num / den) * 100).toFixed(1)}%`;

export const getChangeText = (start: Date, end: Date): string => {
  const now = new Date();

  const startDiffDays = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const endDiffDays = Math.floor(
    (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Case 1: Same day
  if (start.toDateString() === end.toDateString()) {
    if (startDiffDays === 0) return "from today";
    if (startDiffDays === 1) return "from yesterday";
    if (startDiffDays < 7) return `from ${startDiffDays} days ago`;
    if (startDiffDays < 14) return "from last week";
    if (startDiffDays < 30)
      return `from ${Math.floor(startDiffDays / 7)} weeks ago`;
    if (startDiffDays < 60) return "from last month";
    if (startDiffDays < 365)
      return `from ${Math.floor(startDiffDays / 30)} months ago`;
    if (startDiffDays < 730) return "from one year ago";
    return `from ${Math.floor(startDiffDays / 365)} years ago`;
  }

  // Case 2: Range
  if (startDiffDays < 7 && endDiffDays === 0) return "this week";
  if (startDiffDays < 14 && endDiffDays <= 7) return "last week";
  if (startDiffDays < 30 && endDiffDays === 0) return "this month";
  if (startDiffDays < 60 && endDiffDays <= 30) return "last month";

  // Fallback: generic date span
  return `from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
};

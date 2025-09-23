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

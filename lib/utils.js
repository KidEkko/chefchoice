import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function BreakDownFormData(formData) {
  const data = {};
  for (const pair of formData.entries()) data[pair[0]] = pair[1]
  return data;
}

export function DateString(date) {
  return date.toISOString().split("T")[0];
}

export function MidnightUTC(date) {
  return new Date(DateString(date) + "T00:00:00Z");
}

export function roundedTime(time) {
  return parseFloat((time / 1000).toFixed(2));
}

export function TimeToMidnightUTC() {
  const now = new Date();
  const midnightUTC = MidnightUTC(now);
  midnightUTC.setUTCDate(midnightUTC.getUTCDate() + 1);

  return (midnightUTC.getTime() - now.getTime()) / 1000;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

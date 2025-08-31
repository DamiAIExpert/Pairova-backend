// src/common/utils/date.utils.ts

/**
 * Converts a date-like input into an ISO 8601 string format.
 * If the input is null or undefined, it returns the current date and time.
 *
 * @param {Date | string | number} [input] - The date to convert. Can be a Date object, string, or timestamp.
 * @returns {string} The date formatted as an ISO string (e.g., "2023-10-27T10:00:00.000Z").
 */
export function toIso(input?: Date | string | number): string {
  if (!input) return new Date().toISOString();
  return new Date(input).toISOString();
}

/**
 * Adds a specified number of minutes to a given date.
 *
 * @param {number} minutes - The number of minutes to add.
 * @param {Date} [date=new Date()] - The starting date. Defaults to now.
 * @returns {Date} A new Date object representing the calculated future time.
 */
export function addMinutes(minutes: number, date: Date = new Date()): Date {
  return new Date(date.getTime() + minutes * 60000);
}

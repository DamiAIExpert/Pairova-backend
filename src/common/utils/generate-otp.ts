// src/common/utils/generate-otp.ts
import { randomInt } from 'crypto';

/**
 * Generates a secure, numeric One-Time Password (OTP) of a specified length.
 * Uses the cryptographically secure `randomInt` function for better randomness than `Math.random`.
 *
 * @param {number} [length=6] - The desired length of the OTP. Defaults to 6.
 * @returns {string} The generated OTP as a string.
 */
export function generateOTP(length = 6): string {
  if (length <= 0) {
    throw new Error('OTP length must be a positive number.');
  }
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return randomInt(min, max).toString().padStart(length, '0');
}

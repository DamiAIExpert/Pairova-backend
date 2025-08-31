// src/common/utils/file.utils.ts
import * as path from 'path';
import { randomBytes } from 'crypto';

/**
 * Generates a unique filename to prevent naming collisions upon upload.
 * It combines the original base name with a random string and the original extension.
 *
 * @param {string} originalName - The original name of the file (e.g., 'my-resume.pdf').
 * @returns {string} A unique filename (e.g., 'my-resume-a1b2c3d4.pdf').
 */
export function uniqueFilename(originalName: string): string {
  const ext = path.extname(originalName || '');
  const base = path.basename(originalName || 'file', ext);
  const randomSuffix = randomBytes(4).toString('hex');
  
  // Sanitize base name to remove characters that are problematic for file systems
  const sanitizedBase = base.replace(/[^a-z0-9_.-]/gi, '_');

  return `${sanitizedBase}-${randomSuffix}${ext}`;
}

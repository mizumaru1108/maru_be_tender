import { BadRequestException } from '@nestjs/common';

/**
 * Func to validate file size
 * @param file
 * @param maxSize - optional
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileSize(
  file: Express.Multer.File,
  maxSize?: number,
): boolean {
  let max = maxSize ? maxSize : 1024 * 1024 * 3; // default is 3MB
  if (file.size > max) {
    throw new BadRequestException(
      `File size ${file.size} is larger than ${maxSize} bytes`,
    );
  }
  return true;
}

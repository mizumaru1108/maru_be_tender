import { BadRequestException } from '@nestjs/common';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { InvalidFileSizeException } from '../../tender-commons/exceptions/invalid-file-size.exception';
import { convertBytesToMB } from './bytes-to-mb-converter';

/**
 * Func to validate file size
 * @param file - MulterFile or number (size of the file)
 * @param maxSize - optional default is 3MB
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileUploadSize(
  fileOrFileSize: MulterFile | number,
  maxSize?: number,
): boolean {
  const max = maxSize ? maxSize : 1024 * 1024 * 3; // default is 3MB

  const fileSize =
    typeof fileOrFileSize === 'number' ? fileOrFileSize : fileOrFileSize.size;

  if (fileSize > max) {
    throw new BadRequestException(
      `File size ${convertBytesToMB(
        fileSize,
      )} is larger than ${convertBytesToMB(max)} bytes`,
    );
  }
  return true;
}

export function validateFileSize(
  fileOrFileSize: MulterFile | number,
  maxSize?: number,
  fileName?: string,
): boolean {
  try {
    const max = maxSize ? maxSize : 1024 * 1024 * 3; // default is 3MB

    const fileSize =
      typeof fileOrFileSize === 'number' ? fileOrFileSize : fileOrFileSize.size;

    if (fileSize > max) {
      throw new InvalidFileSizeException(
        `File${fileName ? `(${fileName})` : ''} size ${convertBytesToMB(
          fileSize,
        )} is larger than ${convertBytesToMB(max)} bytes`,
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
}

import { BadRequestException } from '@nestjs/common';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';

/**
 * Func to validate file size
 * @param file - MulterFile or number (size of the file)
 * @param maxSize - optional default is 3MB
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileSize(
  fileOrFileSize: MulterFile | number,
  maxSize?: number,
): boolean {
  let max = maxSize ? maxSize : 1024 * 1024 * 3; // default is 3MB

  const fileSize =
    typeof fileOrFileSize === 'number' ? fileOrFileSize : fileOrFileSize.size;

  if (fileSize > max) {
    throw new BadRequestException(
      `File size ${fileSize} is larger than ${maxSize} bytes`,
    );
  }
  return true;
}

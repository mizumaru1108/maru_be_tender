import { BadRequestException } from '@nestjs/common';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { AllowedFileType } from '../enums/allowed-filetype.enum';

/**
 * Func to validate the allowed file type
 * @param file
 * @param allowed
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateAllowedExtension(
  file: MulterFile,
  allowed: AllowedFileType[],
): boolean {
  const fileExtension = file.mimetype;
  if (!allowed.includes(fileExtension as AllowedFileType)) {
    throw new BadRequestException(
      `File extension ${fileExtension} is not allowed`,
    );
  }
  return true;
}

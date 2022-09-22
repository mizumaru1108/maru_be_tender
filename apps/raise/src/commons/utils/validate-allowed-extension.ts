import { BadRequestException } from '@nestjs/common';
import { AllowedFileType } from '../enums/allowed-filetype.enum';

/**
 * Func to validate the allowed file type
 * @param file
 * @param allowed
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateAllowedExtension(
  file: Express.Multer.File,
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

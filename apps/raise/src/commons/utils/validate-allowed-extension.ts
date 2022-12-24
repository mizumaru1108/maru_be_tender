import { BadRequestException } from '@nestjs/common';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { AllowedFileType } from '../enums/allowed-filetype.enum';

/**
 * Func to validate the allowed file type
 * @param fileOrMimeType - MulterFile or string
 * @param allowed - AllowedFileType[]
 * @returns {boolean} - true if allowed
 * @author RDanang (Iyoy)
 */
export function validateAllowedExtension(
  fileOrMimeType: MulterFile | string,
  allowed: AllowedFileType[],
): boolean {
  const fileExtension =
    typeof fileOrMimeType === 'string'
      ? fileOrMimeType
      : fileOrMimeType.mimetype;

  if (!allowed.includes(fileExtension as AllowedFileType)) {
    throw new BadRequestException(
      `File extension ${fileExtension} is not allowed, allowed extensions are: ${allowed}`,
    );
  }
  return true;
}

import { BadRequestException } from '@nestjs/common';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { InvalidFileExtensionException } from '../../tender-commons/exceptions/invalid-file-extension.exception';
import { FileMimeTypeEnum } from '../enums/file-mimetype.enum';

/**
 * Func to validate the allowed file type
 * @param fileOrMimeType - MulterFile or string
 * @param allowed - FileMimeTypeEnum[]
 * @returns {boolean} - true if allowed
 * @author RDanang (Iyoy)
 */
export function validateAllowedExtension(
  fileOrMimeType: MulterFile | string,
  allowed: FileMimeTypeEnum[],
): boolean {
  const fileExtension =
    typeof fileOrMimeType === 'string'
      ? fileOrMimeType
      : fileOrMimeType.mimetype;

  if (!allowed.includes(fileExtension as FileMimeTypeEnum)) {
    throw new BadRequestException(
      `File extension ${fileExtension} is not allowed, allowed extensions are: ${allowed}`,
    );
  }
  return true;
}

export function validateFileExtension(
  fileOrMimeType: MulterFile | string,
  allowed: FileMimeTypeEnum[],
): boolean {
  try {
    const fileExtension =
      typeof fileOrMimeType === 'string'
        ? fileOrMimeType
        : fileOrMimeType.mimetype;

    if (!allowed.includes(fileExtension as FileMimeTypeEnum)) {
      throw new InvalidFileExtensionException(
        `File extension ${fileExtension} is not allowed, allowed extensions are: ${allowed}`,
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
}

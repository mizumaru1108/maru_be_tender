import { FileMimeTypeEnum } from '../../commons/enums/file-mimetype.enum';
import { generateRandomString } from '../../commons/utils/generate-random-string';

export const generateFileName = (
  originalName: string,
  mimeType: FileMimeTypeEnum,
): string => {
  return (
    originalName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) +
    generateRandomString(5) +
    new Date().getTime() +
    '.' +
    mimeType.split('/')[1]
  );
};

import { FileMimeTypeEnum } from '../../commons/enums/file-mimetype.enum';

export const generateFileName = (
  originalName: string,
  mimeType: FileMimeTypeEnum,
): string => {
  return (
    originalName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) +
    new Date().getTime() +
    '.' +
    mimeType.split('/')[1]
  );
};

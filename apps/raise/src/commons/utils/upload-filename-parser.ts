import { extname } from 'path';

/**
 * UploadFileNameParser - Used to parse file name before upload to cloud
 * @param fileName File name to be parsed.
 * @returns {Promise<string>} Parsed file name.
 * @author RDanang (Iyoy)
 */
export function uploadFileNameParser(
  fileName: string,
  randomCharLength?: number,
): string {
  const fileExtName = extname(fileName);
  const name = fileName
    .split(fileExtName)[0] // get the name and remove the extension.
    .replace(/ /g, '_') // replace all spaces with _
    .replace(/(\W+)/gi, '_') // replace all non-word characters with _
    .substring(0, 15) // get the frist 15 characters.
    .toLowerCase(); // convert to lowercase
  const initLength = 12;
  const randomName = Array(randomCharLength || initLength)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return `${name}-${randomName}${fileExtName}`;
}

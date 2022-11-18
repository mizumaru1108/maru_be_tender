import { Prisma } from '@prisma/client';
import { UploadFilesJsonbDto } from '../dto/upload-files-jsonb.dto';

export async function compareUrl(
  oldValue: Prisma.JsonValue | null,
  file: UploadFilesJsonbDto,
): Promise<boolean> {
  let isSame = true;

  if (
    oldValue && // if old value is not null
    typeof oldValue === 'object' && // if old value is object
    'url' in oldValue && // if old value has url property
    typeof oldValue['url'] === 'string' && // if old value url is string
    oldValue['url'] !== file.url // if old value url is not equal to new url
  ) {
    // delete the old file
    console.log(
      "the old image url is different from the new one, let's delete it",
    );

    if (oldValue['url'].includes('https://media.tmra.io/')) {
      oldValue['url'] = oldValue['url'].replace('https://media.tmra.io/', '');
    }
    // console.log(oldValue['url']);

    const isExist = await this.bunnyService.checkIfImageExists(oldValue['url']);

    if (isExist) {
      const deleteImages = await this.bunnyService.deleteImage(oldValue['url']);
      if (!deleteImages) {
        throw new Error(`Failed to delete at update proposal`);
      }
    }

    isSame = false;
  }

  return isSame;
}

export enum FileType {
  image = 'image',
  pdf = 'pdf',
}

const pdfFile = ['application/pdf'];
const imageFile = ['image/png', 'image/jpeg', 'image/jpg'];

export const checkFileExtension = (
  ext: string,
  typeFile: FileType,
  isInclude: boolean
): boolean => {
  if (typeFile === FileType.image) {
    // return imageFile.includes(ext);
    // console.log('masuk if gambar');
    if (isInclude) {
      // console.log('masuk if gambar include', imageFile.includes(ext));
      return imageFile.includes(ext);
    } else {
      // console.log('masuk if gambar exclude');
      return false;
    }
  }
  if (typeFile === FileType.pdf) {
    // return pdfFile.includes(ext);
    if (isInclude) {
      return pdfFile.includes(ext);
    } else {
      return false;
    }
  }
  return false;
};

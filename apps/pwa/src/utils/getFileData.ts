// components
import { BeneficiariesMap, target_type_map } from '../@types/supervisor-accepting-form';
import { CustomFile } from '../components/upload/type';

// ----------------------------------------------------------------------

export default function getFileData(file: CustomFile | string, index?: number) {
  // console.log('file', file);
  if (typeof file === 'string') {
    return {
      key: index ? `${file}-${index}` : file,
      preview: file,
    };
  }
  return {
    key: index ? `${file.name}-${index}` : file.name,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    fileExtension: file.fileExtension,
    fullName: file.fullName,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}

export const getValueLocalStorage = (key: string) => {
  const value =
    localStorage.getItem(key) &&
    localStorage.getItem(key) !== 'undefined' &&
    localStorage.getItem(key) !== 'null' &&
    localStorage.getItem(key);
  return value;
};

export const getOldTargetGroupType = (value: string): string => {
  const tmpTargetGrpType = target_type_map[value.toUpperCase() as keyof BeneficiariesMap]
    ? `review.target_group_type_enum.${value}`
    : value;
  return tmpTargetGrpType;
};

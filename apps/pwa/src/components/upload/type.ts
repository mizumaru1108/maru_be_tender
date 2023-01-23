import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';
// @mui
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface FileProp {
  url: string;
  size: number | undefined;
  type: string;
  base64Data?: string;
  fileExtension?: string;
  fullName?: string;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: FileProp; //CustomFile | string | null;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  files: (File | string)[];
  error?: boolean;
  showPreview?: boolean;
  sx?: SxProps<Theme>;
  helperText?: ReactNode;
  onUpload?: VoidFunction;
  onRemove?: (file: File | string) => void;
  onRemoveAll?: VoidFunction;
}

// form
import { useFormContext, Controller, useForm } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
// type
import {
  UploadAvatar,
  UploadMultiFile,
  UploadSingleFile,
  UploadProps,
  UploadMultiFileProps,
} from '../upload';
import { useCallback, useState } from 'react';
import axiosInstance from 'utils/axios';
import { getFileURL } from 'utils/getFileURL';
import useAuth from 'hooks/useAuth';
// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  placeholder?: string;
}

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar
              accept={{ 'image/*': [] }}
              error={checkError}
              {...other}
              file={field.value}
            />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadSingleFile({ name, placeholder, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ size: number | undefined; type: string }>({
    size: undefined,
    type: '',
  });
  // TODO defining the fileInfo when the field is exist
  // const { watch } = useForm();
  // const commingFile = watch('project_attachments');
  // console.log(commingFile);
  // useEffect(() => {
  //   console.log('in');
  //   if (commingFile && commingFile?.value !== '') {
  //     console.log('in in ');
  //     const type = commingFile.value.split('.').at(-1);
  //     setFileInfo((prevValue: { size: number | undefined; type: string }) => ({
  //       ...prevValue,
  //       size: 1,
  //       type: 'image/jpeg',
  //     }));
  //   }
  // }, [commingFile]);
  const id = user?.id;
  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const userId = id;
      const formdata = new FormData();
      formdata.append('file', file);
      formdata.append('userId', userId);
      try {
        setUploading(true);
        const response = await axiosInstance.post('/tender/uploads', formdata);
        if (response.data) {
          setValue(name, getFileURL(response.data.data));
          setUploading(false);
          setFileInfo((prevValue: { size: number | undefined; type: string }) => ({
            ...prevValue,
            size: acceptedFiles[0].size / 28,
            type: acceptedFiles[0].type,
          }));
        }
      } catch (e) {
        setUploading(false);
        alert(e.message);
      }
    },
    [id, name, setValue]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;
        return (
          <UploadSingleFile
            placeholder={placeholder ?? ''}
            file={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              )
            }
            {...other}
            onDrop={handleDrop}
            uploading={uploading}
            fileInfo={fileInfo}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFUploadMultiFileProps extends Omit<UploadMultiFileProps, 'files'> {
  name: string;
}

export function RHFUploadMultiFile({ name, ...other }: RHFUploadMultiFileProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;

        return (
          <UploadMultiFile
            accept={{ 'image/*': [] }}
            files={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}

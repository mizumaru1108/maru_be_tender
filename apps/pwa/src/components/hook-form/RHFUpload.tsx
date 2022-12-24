// form
import { useFormContext, Controller } from 'react-hook-form';
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
import { getFileURL } from 'utils/getFileURL';
import useAuth from 'hooks/useAuth';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
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
        const response = await axios.post(`${TMRA_RAISE_URL}/tender/uploads`, formdata);
        if (response.data) {
          setValue(name, {
            url: getFileURL(response.data.data),
            type: acceptedFiles[0].type,
            size: acceptedFiles[0].size / 28,
          });
          setUploading(false);
        }
      } catch (e) {
        setUploading(false);
        alert(e.data.mesage);
      }
    },
    [id, name, setValue]
  );

  const onRemove = () => {
    setValue(name, {
      url: '',
      type: '',
      size: '',
    });
  };
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
            onRemove={onRemove}
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

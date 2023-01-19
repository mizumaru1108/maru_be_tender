// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
// type
import { UploadSingleFile, UploadProps } from '../upload';
import { useCallback, useState } from 'react';
import { getFileURL } from 'utils/getFileURL';
import useAuth from 'hooks/useAuth';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { encodeBase64Upload, getBase64Upload } from '../../utils/getBase64';
import { async } from '@firebase/util';
// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  placeholder?: string;
}

// ----------------------------------------------------------------------

export function RHFUploadSingleFileBe({ name, placeholder, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const id = user?.id;
  // const handleDrop = useCallback(
  //   async (acceptedFiles: File[]) => {
  //     const file = acceptedFiles[0];
  //     const userId = id;
  //     const formdata = new FormData();
  //     formdata.append('file', file);
  //     formdata.append('userId', userId);
  //     try {
  //       setUploading(true);
  //       const response = await axios.post(`${TMRA_RAISE_URL}/tender/uploads`, formdata);
  //       if (response.data) {
  //         setValue(name, {
  //           url: getFileURL(response.data.data),
  //           type: acceptedFiles[0].type,
  //           size: acceptedFiles[0].size / 28,
  //         });
  //         setUploading(false);
  //       }
  //     } catch (e) {
  //       setUploading(false);
  //       alert(e.data.mesage);
  //     }
  //   },
  //   [id, name, setValue]
  // );

  const handleDrop = async (acceptedFiles: File[]) => {
    // console.log('acceptedFiles', acceptedFiles);
    const base64Data = await encodeBase64Upload(acceptedFiles[0]);
    // const base64Data = await fileToBinary(acceptedFiles[0]);
    const fullName = acceptedFiles[0].name;
    const fileExtension = acceptedFiles[0].type;
    setValue(name, {
      url: URL.createObjectURL(acceptedFiles[0]),
      type: acceptedFiles[0].type,
      size: acceptedFiles[0].size,
      base64Data,
      fullName,
      fileExtension,
    });
  };

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
        const checkError = !!error;
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
            // uploading={uploading}
            onRemove={onRemove}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

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
import { useCompress } from '../../utils/compressFile';
// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

// ----------------------------------------------------------------------

export function RHFUploadSingleFileBe({ name, placeholder, disabled, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const { user } = useAuth();
  const { progress, isCompressing, compress } = useCompress();

  const id = user?.id;
  const handleDrop = async (acceptedFiles: File[]) => {
    const fileType = acceptedFiles[0].type.split('/')[0];
    // console.log('acceptedFiles[0].type', fileType);
    if (fileType === 'application') {
      const fileBuffer = await encodeBase64Upload(acceptedFiles[0]);
      setValue(name, {
        url: URL.createObjectURL(acceptedFiles[0]),
        type: acceptedFiles[0].type,
        size: fileBuffer.length,
        base64Data: fileBuffer,
        fullName: acceptedFiles[0].name,
        fileExtension: acceptedFiles[0].type,
        file: acceptedFiles,
      });
    } else if (fileType === 'image') {
      const compressFile = compress(acceptedFiles[0], {
        maxSizeMB: 1,
        maxWidthOrHeight: 900,
        useWebWorker: false,
      });
      compressFile
        .then(async (compresedFile) => {
          const fileBuffer = await encodeBase64Upload(compresedFile);
          setValue(name, {
            url: URL.createObjectURL(acceptedFiles[0]),
            type: acceptedFiles[0].type,
            size: fileBuffer.length,
            base64Data: fileBuffer,
            fullName: acceptedFiles[0].name,
            fileExtension: acceptedFiles[0].type,
            file: acceptedFiles,
          });
        })
        .catch((err) => {
          console.error('Unable to compress file', err);
        });
    }
    // const compressFile = compress(acceptedFiles[0], {
    //   maxSizeMB: 1,
    //   maxWidthOrHeight: 900,
    //   useWebWorker: false,
    // });
    // compressFile
    //   .then(async (compresedFile) => {
    //     const fileBuffer = await encodeBase64Upload(compresedFile);

    //     setValue(name, {
    //       url: URL.createObjectURL(acceptedFiles[0]),
    //       type: acceptedFiles[0].type,
    //       size: fileBuffer.length,
    //       base64Data: fileBuffer,
    //       fullName: acceptedFiles[0].name,
    //       fileExtension: acceptedFiles[0].type,
    //     });
    //   })
    //   .catch((err) => {
    //     console.error('Unable to compress file', err);
    //   });
  };

  const onRemove = () => {
    setValue(name, {
      url: '',
      type: '',
      size: undefined,
      base64Data: '',
      fullName: '',
      fileExtension: '',
      file: undefined,
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
            disabled={isCompressing ? true : disabled}
            isCompressing={isCompressing}
            progress={progress}
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

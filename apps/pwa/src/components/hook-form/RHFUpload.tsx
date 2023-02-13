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
import { encodeBase64Upload, fileToBinary } from '../../utils/getBase64';
import { useCompress } from '../../utils/compressFile';
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
  // const id = user?.id;

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      // const userId = id;

      setUploading(true);

      try {
        const fileBuffer = await encodeBase64Upload(file);
        const preview = URL.createObjectURL(file);

        setValue(name, {
          url: preview,
          type: file.type,
          size: file.size,
          base64Data: fileBuffer,
          fullName: file.name,
          fileExtension: file.type,
        });

        setUploading(false);
      } catch (error) {
        setUploading(false);
        throw error.message;
      }

      // const formdata = new FormData();
      // formdata.append('file', file);
      // formdata.append('userId', userId);
      // try {
      //   setUploading(true);
      //   const response = await axios.post(`${TMRA_RAISE_URL}/tender/uploads`, formdata);
      //   if (response.data) {
      //     setValue(name, {
      //       url: getFileURL(response.data.data),
      //       type: acceptedFiles[0].type,
      //       size: acceptedFiles[0].size / 28,
      //     });
      //     setUploading(false);
      //   }
      // } catch (e) {
      //   setUploading(false);
      //   alert(e.data.mesage);
      // }
    },
    [name, setValue]
  );

  const onRemove = () => {
    setValue(name, {
      url: '',
      size: undefined,
      type: '',
      base64Data: undefined,
      fullName: '',
      fileExtension: '',
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
  placeholder?: string;
}

export function RHFUploadMultiFile({
  name,
  placeholder,
  disabled,
  ...other
}: RHFUploadMultiFileProps) {
  const { progress, isCompressing, compress } = useCompress();
  const { control, getValues, setValue } = useFormContext();

  // const handleDrop = useCallback<(acceptedFiles: File[]) => void>(
  //   (acceptedFiles) => {
  //     const images = getValues(name);
  //     const newImages = acceptedFiles.map((file) =>{
  //       const base64 = await encodeBase64Upload(file);
  //       const preview = URL.createObjectURL(file);
  //     }
  //       // Object.assign(file, {
  //       //   preview: URL.createObjectURL(file),
  //       // })
  //     );
  //     if (images) {
  //       setValue(name, [...images, ...newImages]);
  //     } else {
  //       setValue(name, [...newImages]);
  //     }
  //     // setValue(name, [...getValues(name), ...newImages]);
  //     // console.log('images=', newImages);
  //   },
  //   [setValue]
  // );

  const handleDrop = async (acceptedFiles: File[]) => {
    const images = getValues(name);
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => {
        const fileBuffer = await encodeBase64Upload(file);
        const fileType = file.type.split('/')[0];
        const preview = URL.createObjectURL(file);
        // if (fileType === 'application') {
        //   const base64Data = await encodeBase64Upload(file);
        //   return {
        //     ...file,
        //     preview,
        //     base64Data,
        //     fullName: file.name,
        //     fileExtension: file.type,
        //     size: file.size,
        //   };
        // } else if (fileType === 'image') {
        //   let tmpFile = {};
        //   const compressFile = compress(file, {
        //     maxSizeMB: 1,
        //     maxWidthOrHeight: 900,
        //     useWebWorker: false,
        //   });
        //   compressFile
        //     .then(async (compresedFile) => {
        //       const fileBuffer = await encodeBase64Upload(compresedFile);
        //       // setValue(name, {
        //       //   ...file,
        //       //   preview,
        //       //   base64Data: fileBuffer,
        //       //   fullName: file.name,
        //       //   fileExtension: file.type,
        //       //   size: file.size,
        //       // });
        //       tmpFile = {
        //         ...file,
        //         preview,
        //         base64Data: fileBuffer,
        //         fullName: file.name,
        //         fileExtension: file.type,
        //         size: file.size,
        //       };
        //       console.log('tmpFile=', tmpFile);
        //     })
        //     .catch((err) => {
        //       console.error('Unable to compress file', err);
        //     });
        //   // console.log('tmpFile=', tmpFile);
        //   return tmpFile;
        // } else {
        //   const base64Data = await encodeBase64Upload(file);
        //   return {
        //     ...file,
        //     preview,
        //     base64Data,
        //     fullName: file.name,
        //     fileExtension: file.type,
        //     size: file.size,
        //   };
        // }
        return {
          ...file,
          preview,
          base64Data: fileBuffer,
          fullName: file.name,
          fileExtension: file.type,
          size: file.size,
        };
      })
    );
    // console.log('newImages=', newImages);
    if (images) {
      setValue(name, [...images, ...newImages]);
    } else {
      setValue(name, [...newImages]);
    }
    // setValue(name, [...getValues(name), ...newImages]);
    // console.log('images=', newImages);
  };
  const handleRemoveAll = () => {
    setValue(name, []);
    // console.debug('images=', []);
  };
  const handleRemove = (file: File | string) => {
    const filteredItems = getValues(name)!.filter((_file: any) => _file !== file);
    setValue(name, filteredItems);
    // console.debug('images=', filteredItems);
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;

        return (
          <UploadMultiFile
            accept={{
              // 'image/*': [],
              'image/png': [],
              'image/jpeg': [],
              'image/jpg': [],
              'application/pdf': [],
            }}
            maxSize={1024 * 1024 * 3}
            files={field.value}
            showPreview
            placeholder={placeholder ?? ''}
            disabled={disabled}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
            onDrop={handleDrop}
            onRemoveAll={handleRemoveAll}
            onRemove={handleRemove}
          />
        );
      }}
    />
  );
}

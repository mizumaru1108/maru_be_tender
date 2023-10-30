import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
// type
import { UploadProps } from './type';
//
import Image from '../Image';
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';
import { CircularProgressWithLabel } from '../animate/variants/CircularProgress';
import { convertBytesToMB } from '../../utils/convertByteToMBString';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(0, 1),
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `2px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

interface Props extends UploadProps {
  placeholder?: string;
  uploading?: boolean;
  onRemove: () => void;
  isCompressing?: boolean;
  progress?: number;
}

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  placeholder,
  uploading,
  disabled,
  onRemove,
  isCompressing,
  progress,
  ...other
}: Props) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });
  // console.log({ isDragActive, isDragReject, getInputProps });
  return (
    <Grid container spacing={file.url === '' ? 0 : 5} sx={{ width: '100%', ...sx }}>
      <Grid item md={file.url === '' ? 12 : 10} xs={file.url === '' ? 12 : 10}>
        {/* CircularProgressWithLabel */}
        <DropZoneStyle
          {...(!disabled && getRootProps())}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter',
            }),
            ...(file &&
              file.type.split('/')[0] === 'image' && {
                padding: '12% 0',
              }),
          }}
        >
          {/* <input {...getInputProps()} /> */}
          {isCompressing && <CircularProgressWithLabel value={progress ?? 0} />}
          {!isCompressing && <input {...getInputProps()} />}
          {((!isCompressing && file.url === '') || uploading) && (
            <BlockContent placeholder={placeholder} uploading={uploading} />
          )}

          {file && file.type.split('/')[0] === 'image' && !uploading && (
            <>
              <Image
                alt="file preview"
                src={file.url}
                sx={{
                  top: 8,
                  left: 8,
                  borderRadius: 1,
                  position: 'absolute',
                  width: 'calc(100% - 16px)',
                  height: 'calc(100% - 16px)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  borderRadius: 1,
                  backgroundColor: '#0E8478',
                  opacity: 0.8,
                  py: 0.5,
                  px: 1,
                  color: 'white',
                }}
              >
                {`File size ${convertBytesToMB(file.size ?? 0)}`}
              </Box>
            </>
          )}
          {!isCompressing && file && file.type === 'application/pdf' && !uploading && (
            <Box
              sx={{
                flex: 1,
                '&:hover': { backgroundColor: '#00000014' },
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  padding: '8px',
                  borderRadius: '10px',
                }}
                flex={1}
              >
                <Stack direction="row" gap={2}>
                  <Stack direction="column" justifyContent="center">
                    <img
                      src={`/icons/pdf-icon.svg`}
                      alt=""
                      style={{ width: '30px', height: '30px' }}
                    />
                  </Stack>
                  <Stack direction="column">
                    <Typography gutterBottom sx={{ fontSize: '13px' }}>
                      {placeholder}
                    </Typography>
                    <Typography gutterBottom sx={{ fontSize: '13px' }}>
                      {/* {`${file.size !== undefined && Math.floor(file.size / 28)}KB`} */}
                      {`File size ${convertBytesToMB(file.size ?? 0)}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          )}
        </DropZoneStyle>
      </Grid>
      {!isCompressing && file.url !== '' && (
        <Grid item md={2} xs={2}>
          <Button
            sx={{
              color: '#fff',
              backgroundColor: '#FF4842',
              ':hover': {
                backgroundColor: '#FF170F',
              },
            }}
            disabled={disabled}
            onClick={onRemove}
          >
            حذف
          </Button>
        </Grid>
      )}
      {!isCompressing && fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}
      {helperText && helperText}
    </Grid>
  );
}

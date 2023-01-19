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
}

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  placeholder,
  uploading,
  onRemove,
  ...other
}: Props) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });
  return (
    <Grid container spacing={file.url === '' ? 0 : 5} sx={{ width: '100%', ...sx }}>
      <Grid item md={file.url === '' ? 12 : 10} xs={file.url === '' ? 12 : 10}>
        <DropZoneStyle
          {...getRootProps()}
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
          <input {...getInputProps()} />

          {(file.url === '' || uploading) && (
            <BlockContent placeholder={placeholder} uploading={uploading} />
          )}

          {file && file.type.split('/')[0] === 'image' && !uploading && (
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
          )}
          {file && file.type === 'application/pdf' && !uploading && (
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
                      {`${file.size !== undefined && Math.floor(file.size / 28)}KB`}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          )}
        </DropZoneStyle>
      </Grid>
      {file.url !== '' && (
        <Grid item md={2} xs={2}>
          <Button
            sx={{
              color: '#fff',
              backgroundColor: '#FF4842',
              ':hover': {
                backgroundColor: '#FF170F',
              },
            }}
            onClick={onRemove}
          >
            حذف
          </Button>
        </Grid>
      )}
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {helperText && helperText}
    </Grid>
  );
}

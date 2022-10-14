import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
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
  fileInfo?: { size: number | undefined; type: string };
}

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  placeholder,
  uploading,
  fileInfo,
  ...other
}: Props) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });
  return (
    <Box sx={{ width: '100%', ...sx }}>
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
            fileInfo &&
            fileInfo.type === 'image/jpeg' && {
              padding: '12% 0',
            }),
        }}
      >
        <input {...getInputProps()} />

        {!file && <BlockContent placeholder={placeholder} uploading={uploading} />}

        {file && fileInfo && fileInfo.type === 'image/jpeg' && (
          <Image
            alt="file preview"
            src={typeof file === 'string' ? file : file.preview}
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
        {file && fileInfo && fileInfo.type === 'application/pdf' && (
          <Box
            sx={{
              flex: 1,
              '&:hover': { backgroundColor: '#00000014' },
              backgroundColor: '#93A3B014',
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
                    {`${fileInfo.size}KB`}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {helperText && helperText}
    </Box>
  );
}

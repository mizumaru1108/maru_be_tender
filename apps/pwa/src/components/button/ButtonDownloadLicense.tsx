import { Button, Link, Stack, Typography } from '@mui/material';
import { UploadFilesJsonbDto } from '../../@types/commons';
import useLocales from '../../hooks/useLocales';
import { FileProp } from '../upload';

interface Props {
  files: UploadFilesJsonbDto;
}

function ButtonDownlaodLicense({ files }: Props) {
  const { translate } = useLocales();
  return (
    <Button
      fullWidth
      component={Link}
      href={files.url ?? '#'}
      download="ملف مرفقات المشروع"
      target="_blank"
      rel="noopener noreferrer"
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
            <img src={`/icons/pdf-icon.svg`} alt="" />
          </Stack>
          <Stack direction="column">
            <Typography gutterBottom sx={{ fontSize: '13px' }}>
              {translate('project_attachment_file')}
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '13px' }}>
              {files.size !== undefined ? `${files.size.toFixed(2)}KB` : '126KB'}
            </Typography>
          </Stack>
        </Stack>
        <img src={`/assets/icons/download-icon.svg`} alt="" style={{ width: 25, height: 25 }} />
      </Stack>
    </Button>
  );
}
export default ButtonDownlaodLicense;

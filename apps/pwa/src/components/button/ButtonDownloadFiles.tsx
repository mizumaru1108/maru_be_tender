import { Button, Link, Stack, Typography } from '@mui/material';
import { UploadFilesJsonbDto } from '../../@types/commons';
import useLocales from '../../hooks/useLocales';
import { convertBytesToMB } from '../../utils/convertByteToMBString';
import { FileProp } from '../upload';

interface Props {
  files: UploadFilesJsonbDto;
  // fileType?: string;
  border?: string;
  isMessageAttachment?: boolean;
}

function ButtonDownloadFiles({ files, border, isMessageAttachment }: Props) {
  const { translate } = useLocales();
  // console.log('files', files);
  const fileType = files?.type ? files?.type!.split('/')[1] : 'pdf';
  const fileName = files && files.url ? (files?.url.split('/').pop() as string) : '';
  const fileSize = files && files.size ? convertBytesToMB(files.size) : '';
  // console.log('fileName', fileName);
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
        backgroundColor: '#DFE4E8',
        border: 3,
        borderColor: files && files.color ? files.color : !!border ? border : 'transparent',
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
        {/* <Stack direction="row" gap={2}> */}
        <Stack direction="column" justifyContent="center">
          {/* <img src={`/icons/doc-icon.svg`} alt="" /> */}
          <img
            src={
              ['png', 'jpg', 'jpeg'].includes(fileType)
                ? '/icons/img-icon.png'
                : '/icons/pdf-icon.svg'
            }
            style={{ width: 24, height: 24 }}
            alt=""
          />
        </Stack>
        <Stack direction="column">
          <Typography gutterBottom sx={{ fontSize: '13px' }}>
            {`${fileName.substring(0, 7)}... .${fileType}` ?? '-'}
          </Typography>
          <Typography gutterBottom sx={{ fontSize: '13px' }}>
            {files.size !== undefined ? `${fileSize}` : '126KB'}
          </Typography>
        </Stack>
        {/* </Stack> */}
        <img src={`/assets/icons/download-icon.svg`} alt="" style={{ width: 25, height: 25 }} />
      </Stack>
    </Button>
  );
}
export default ButtonDownloadFiles;

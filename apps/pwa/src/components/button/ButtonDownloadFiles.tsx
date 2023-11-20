import { Button, Link, Stack, Typography } from '@mui/material';
import { UploadFilesJsonbDto } from '../../@types/commons';
import useLocales from '../../hooks/useLocales';
import { convertBytesToMB } from '../../utils/convertByteToMBString';
import { FileProp } from '../upload';

const TYPEMAPPERS = {
  attachments: 'button.attachment',
  board_ofdec_file: 'button.board_ofdec_file',
};

interface Props {
  files: UploadFilesJsonbDto;
  // fileType?: string;
  border?: string;
  isMessageAttachment?: boolean;
  type?: 'attachments' | 'board_ofdec_file';
}

function ButtonDownloadFiles({ files, border, isMessageAttachment, type = 'attachments' }: Props) {
  const { translate } = useLocales();
  const fileType = files?.type ? files?.type!.split('/')[1] : 'pdf';
  const fileName = files && files?.url ? (files?.url.split('/').pop() as string) : '';
  const fileSize = files && files?.size ? convertBytesToMB(files.size) : '';
  return (
    <Button
      component={Link}
      href={files.url ?? '#'}
      download="ملف مرفقات المشروع"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        '&:hover': { backgroundColor: '#00000014' },
        backgroundColor: '#DFE4E8',
        border: 3,
        borderColor: files && files.color ? files.color : !!border ? border : 'transparent',
        justifyContent: 'space-between',
        p: 1.5,
        gap: 1.5,
      }}
      startIcon={
        <img
          src={
            ['png', 'jpg', 'jpeg'].includes(fileType)
              ? '/icons/img-icon.png'
              : '/icons/pdf-icon.svg'
          }
          style={{ width: 24, height: 24 }}
          alt=""
        />
      }
      endIcon={
        <img src={`/assets/icons/download-icon.svg`} alt="" style={{ width: 24, height: 24 }} />
      }
    >
      <Stack direction="column" spacing={{ xs: 1, sm: 0.5 }}>
        <Typography sx={{ fontSize: '13px' }}>{translate(TYPEMAPPERS[`${type}`])}</Typography>
        <Typography sx={{ fontSize: '13px' }}>
          {`${fileName.substring(0, 7)}... .${fileType}` ?? '-'}
        </Typography>
        <Typography sx={{ fontSize: '13px' }}>
          {files.size !== undefined ? `${fileSize}` : '126KB'}
        </Typography>
      </Stack>
    </Button>
  );
}
export default ButtonDownloadFiles;

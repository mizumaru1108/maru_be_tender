import { LoadingButton } from '@mui/lab';
import { Box, Grid, Link, Stack, TableCell, TableRow, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import Iconify from '../../Iconify';
import { CLientListRow } from './types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import { stringSplitUppercase, stringTruncate } from '../../../utils/stringTruncate';

export default function ClientFilesRow({ row, selected, onSelectRow }: CLientListRow) {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  const handleDownloadFile = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <Grid container>
          <Grid item xs={1}>
            {row.type && row.type.split('/').includes('pdf') && (
              <PictureAsPdfIcon sx={{ color: '#13B2A2', height: 25.86 }} />
            )}
            {row.type && row.type.split('/').includes('image') && (
              <ImageIcon sx={{ color: '#13B2A2', height: 25.86 }} />
            )}
          </Grid>
          <Grid item xs={11}>
            <Typography
              variant="subtitle2"
              // noWrap
              noWrap={false}
              sx={{
                direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
                ml: 1,
              }}
            >
              {stringTruncate(row.file_name, 85)}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {(row &&
            row.section_name &&
            stringTruncate(stringSplitUppercase(row.section_name), 30)) ??
            '-'}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Box
          sx={{ display: 'inline-flex', justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => {
            handleDownloadFile(row.link);
          }}
        >
          <DownloadIcon sx={{ color: '#13B2A2', height: 25.86 }} />
        </Box>
      </TableCell>
      <TableCell align="center">
        <LoadingButton
          color="inherit"
          variant="outlined"
          size="medium"
          endIcon={<Iconify icon={'eva:eye-outline'} width={20} height={20} />}
          component={Link}
          href={row.link}
          download="ملف مرفقات المشروع"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate('client_files.btn_file_review')}
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { IEditedValues } from '../../../../@types/client_data';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ButtonDownlaodLicense from '../../../../components/button/ButtonDownloadLicense';
import ButtonDownloadFiles from '../../../../components/button/ButtonDownloadFiles';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
interface Props {
  userInfo: IEditedValues | undefined;
}

const sxPropsText = {
  fontWeight: 500,
  color: 'rgba(147, 163, 176, 0.8)',
  fontSize: '1rem',
  mb: 1,
  mt: 1,
};

function AdministrativeAccording({ userInfo }: Props) {
  const { translate, currentLang } = useLocales();

  return (
    <Accordion
      sx={{
        backgroundColor: 'rgba(147, 163, 176, 0.16)',
        p: 1,
        border: '1px solid rgba(147, 163, 176, 0.16)',
        borderRadius: 1,
        boxShadow: '0 8px 16px 0 rgb(145 158 171 / 24%)',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />}
        aria-controls={`panel1main_information`}
        id={`panel1main_information_header`}
        sx={{
          '& > .MuiAccordionSummary-content': {
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0E8478' }}>
          {translate('project_owner_details.accordion.administrative_tab.header')}
        </Typography>{' '}
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.ceo_name')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.ceo_name ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.ceo_mobile')}
              </Typography>
              <TextField
                sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                disabled
                fullWidth
                value={userInfo?.ceo_mobile ?? '-'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.chairman_name')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.chairman_name ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.chairman_mobile')}
              </Typography>
              <TextField
                sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                disabled
                fullWidth
                value={userInfo?.chairman_mobile ?? '-'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.data_entry_name')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.data_entry_name ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.data_entry_mobile')}
              </Typography>
              <TextField
                sx={{
                  direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
                }}
                disabled
                fullWidth
                value={userInfo?.data_entry_mobile ?? '-'}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.administrative_tab.data_entry_email')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.data_entry_mail ?? '-'} />
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default AdministrativeAccording;

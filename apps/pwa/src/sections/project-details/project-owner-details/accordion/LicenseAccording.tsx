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

function LicenseAccording({ userInfo }: Props) {
  const { translate } = useLocales();

  return (
    <Accordion
      sx={{
        backgroundColor: 'rgba(147, 163, 176, 0.16)',
        // my: 2,
        p: 1.5,
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
          {translate('project_owner_details.accordion.license_tab.header')}
        </Typography>{' '}
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid item xs={12} md={12}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.license_tab.license_number')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.license_number ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.license_tab.license_expiry_date')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.license_expired ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.license_tab.licnese_issue_date')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.license_issue_date ?? '-'} />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.license_tab.license_file')}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} md={4}>
                  <ButtonDownlaodLicense files={userInfo?.license_file ?? {}} />
                </Grid>
              </Grid>
              {/* <TextField disabled fullWidth value={userInfo?.num_of_beneficiaries ?? '-'} /> */}
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.license_tab.letter_of_support_file')}
              </Typography>
              {/* <TextField disabled fullWidth value={userInfo?.num_of_employed_facility ?? '-'} /> */}
              <Grid container spacing={1}>
                {userInfo &&
                  userInfo?.board_ofdec_file &&
                  userInfo?.board_ofdec_file?.length > 0 &&
                  userInfo?.board_ofdec_file.map((file, index) => (
                    <Grid item xs={6} md={4} key={index}>
                      <ButtonDownloadFiles files={file ?? {}} />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default LicenseAccording;

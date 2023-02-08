import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { IEditedValues } from '../../../../@types/client_data';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

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

function ContactAccordion({ userInfo }: Props) {
  const { translate, currentLang } = useLocales();

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
          {translate('project_owner_details.accordion.contact_tab.header')}
        </Typography>{' '}
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.governorate')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.governorate ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.region')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.region ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.center')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.center_administration ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.entity_mobile')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.entity_mobile ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.twitter')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.twitter_acount ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.website')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.website ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.email')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.email ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.contact_tab.phone')}
              </Typography>
              <TextField
                disabled
                fullWidth
                sx={{ direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                value={userInfo?.phone ?? '-'}
              />
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default ContactAccordion;

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

function MainAccordion({ userInfo }: Props) {
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
          {translate('project_owner_details.accordion.main_tab.header')}
        </Typography>{' '}
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid item xs={12} md={12}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.main_tab.entity_field')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.client_field ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.main_tab.headquarters')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.headquarters ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.main_tab.date_of_establishment')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.date_of_esthablistmen ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.main_tab.number_of_beneficiaries')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.num_of_beneficiaries ?? '-'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.main_tab.number_of_employees')}
              </Typography>
              <TextField disabled fullWidth value={userInfo?.num_of_employed_facility ?? '-'} />
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default MainAccordion;

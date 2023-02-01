import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useQuery } from 'urql';
import { IEditedValues } from '../../../@types/client_data';
import { gettingUserDataForEdit } from '../../../queries/client/gettingUserDataForEdit';
import AdministrativeAccording from './accordion/AdministrativeAccording';
import BankInformationAccording from './accordion/BankInformationAccording';
import ContactAccordion from './accordion/ContactAccordion';
import LicenseAccording from './accordion/LicenseAccording';
import MainAccordion from './accordion/MainAccordion';

const sxPropsText = {
  fontWeight: 500,
  color: 'rgba(147, 163, 176, 0.8)',
  fontSize: '1rem',
  mb: 1,
  mt: 1,
};

function DetailClientInfo() {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const id = params.submiterId;
  const [userInfo, setUserInfo] = React.useState<IEditedValues>();
  const [result] = useQuery({ query: gettingUserDataForEdit, variables: { id } });

  const { fetching, data, error } = result;

  React.useEffect(() => {
    if (data) {
      const { user_by_pk } = data;
      const { bank_informations, email, client_data } = user_by_pk;
      let newValues: IEditedValues = {
        ...client_data,
        email,
        bank_informations,
      };
      let newval: any = [];
      if (newValues.board_ofdec_file instanceof Array && newValues.board_ofdec_file.length > 0) {
        newval = [...newValues.board_ofdec_file];
      } else if (typeof newValues.board_ofdec_file === 'object') {
        newval.push(newValues.board_ofdec_file);
      }
      newValues.board_ofdec_file = newval;
      console.log('data', newValues);
      setUserInfo(newValues);
    }
  }, [data]);

  if (fetching) return <>Loading ....</>;

  if (error) return <>{error.message}</>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
        >
          <Iconify
            icon={
              currentLang.value === 'en'
                ? 'eva:arrow-ios-back-outline'
                : 'eva:arrow-ios-forward-outline'
            }
            width={25}
            height={25}
          />
        </Button>
        <Typography
          variant="h4"
          sx={{
            maxWidth: '700px',
          }}
        >
          {/* {proposal.project_name} */}
          {translate('project_owner_details.client_detail_profiles_header')}
        </Typography>
      </Stack>
      {/* Test */}
      {/* <Accordion
        sx={{
          backgroundColor: 'rgba(147, 163, 176, 0.16)',
          my: 2,
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
          expandIcon={<ExpandMoreIcon fontSize="large" color="primary" />}
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
                <TextField disabled fullWidth value={userInfo?.client_field} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={sxPropsText}>
                  {translate('project_owner_details.accordion.main_tab.headquarters')}
                </Typography>
                <TextField disabled fullWidth value={userInfo?.headquarters} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={sxPropsText}>
                  {translate('project_owner_details.accordion.main_tab.date_of_establishment')}
                </Typography>
                <TextField disabled fullWidth value={userInfo?.date_of_esthablistmen} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={sxPropsText}>
                  {translate('project_owner_details.accordion.main_tab.number_of_beneficiaries')}
                </Typography>
                <TextField disabled fullWidth value={userInfo?.num_of_beneficiaries} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={sxPropsText}>
                  {translate('project_owner_details.accordion.main_tab.number_of_employees')}
                </Typography>
                <TextField disabled fullWidth value={userInfo?.num_of_employed_facility} />
              </Grid>
            </Grid>
          </Stack>
        </AccordionDetails>
      </Accordion> */}
      <MainAccordion userInfo={userInfo} />
      <ContactAccordion userInfo={userInfo} />
      <LicenseAccording userInfo={userInfo} />
      <AdministrativeAccording userInfo={userInfo} />
      <BankInformationAccording userInfo={userInfo} />
    </Box>
  );
}

export default DetailClientInfo;

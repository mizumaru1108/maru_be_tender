import { useEffect, useState } from 'react';
// material
import {
  Container,
  styled,
  Typography,
  Button,
  Stack,
  Box,
  useTheme,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
// components
import Page from 'components/Page';
import Iconify from 'components/Iconify';
import Label from 'components/Label';
// sections
import BankImageComp from 'sections/shared/BankImageComp';
// hooks
import { useParams, useNavigate } from 'react-router-dom';
import useLocales from 'hooks/useLocales';
//
import axios from 'axios';
import { HASURA_GRAPHQL_URL, HASURA_ADMIN_SECRET } from 'config';
import { PartnerDetailsProps } from '../../../@types/client_data';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

// -------------------------------------------------------------------------------

function AccountPartnerDetails() {
  const secret = HASURA_ADMIN_SECRET || 'hbd4KbAS5XjHw5';
  const theme = useTheme();

  // Routes
  const params = useParams();
  const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();
  // const accessToken = localStorage.getItem('accessToken');

  // Partner Details Data
  const [partnerDetails, setPartnerDetails] = useState<PartnerDetailsProps | null>(null);

  const getPartnerDetails = async (path: string, id: string) => {
    await axios
      .post(
        `${path}`,
        {
          query: `
            query MyQuery {
              client_data_by_pk(id: "${id}") {
                id
                bank_informations {
                  bank_account_name
                  bank_account_number
                  bank_name
                  card_image
                }
                board_ofdec_file
                center_administration
                ceo_mobile
                ceo_name
                created_at
                data_entry_mail
                data_entry_name
                date_of_esthablistmen
                email
                entity
                entity_mobile
                governorate
                headquarters
                license_expired
                license_file
                license_issue_date
                license_number
                mobile_data_entry
                num_of_beneficiaries
                num_of_employed_facility
                phone
                region
                twitter_acount
                updated_at
                website
              }
            }          
          `,
        },
        {
          headers: {
            'Content-Type': 'aplication/json',
            'x-hasura-admin-secret': `${secret}`,
          },
        }
      )
      .then((res) => {
        setPartnerDetails(res?.data?.data?.client_data_by_pk);
      });
  };

  useEffect(() => {
    const path = HASURA_GRAPHQL_URL;
    const partnerId = params.partnerId as string;

    getPartnerDetails(path, partnerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Partner Details">
      <Container>
        <ContentStyle>
          {!partnerDetails ? (
            <Skeleton variant="rectangular" sx={{ height: 500, borderRadius: 2 }} />
          ) : (
            <>
              <Stack
                spacing={4}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                component="div"
                sx={{ width: '100%' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => navigate(-1)}
                    sx={{ padding: 1, minWidth: 25, minHeight: 25, mr: 3 }}
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
                  <Box>
                    <Typography variant="h4">{partnerDetails?.ceo_name}</Typography>
                    {/* <Typography variant="body1">Ministry of Commerce - Commercial</Typography> */}
                  </Box>
                </Box>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color="warning"
                  sx={{ textTransform: 'capitalize', fontSize: 14, py: 2.5, px: 4 }}
                >
                  Waiting for Activation
                </Label>
              </Stack>
              <Divider />
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  {/* Main Information */}
                  <Stack spacing={2} direction="column" component="div">
                    <Typography variant="h6">
                      {translate('partner_details.main_information')}
                    </Typography>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.number_of_fulltime_employees')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.num_of_employed_facility}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.number_of_beneficiaries')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.num_of_beneficiaries}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.date_of_establishment')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.date_of_esthablistmen}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.headquarters')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.headquarters}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* License Information */}
                  <Stack
                    spacing={2}
                    direction="column"
                    sx={{ backgroundColor: '#FFFFFF', width: '100%', mt: 4, p: 2, borderRadius: 1 }}
                    component="div"
                  >
                    <Typography variant="h6">
                      {translate('partner_details.license_information')}
                    </Typography>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.license_number')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_number}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.entity_clasification')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.entity}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.license_expiry_date')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_expired}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.license_issue_date')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_issue_date}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('partner_details.license_file')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_file}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Administrative Data */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: theme.typography.fontWeightBold }}
                  >
                    {translate('partner_details.administrative_data')}
                  </Typography>
                  <Grid container spacing={{ xs: 2 }} component="div">
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.ceo_name')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.ceo_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.ceo_mobiles')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.ceo_mobile}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.data_entry_name')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.data_entry_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.mobile_data_entry')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.mobile_data_entry}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.data_entry_mail')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.data_entry_mail}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Contact Information */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 4, mb: 2, fontWeight: theme.typography.fontWeightBold }}
                  >
                    {translate('partner_details.contact_information')}
                  </Typography>
                  <Grid container spacing={{ xs: 2 }} component="div">
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.center_management')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.center_administration}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.governorate')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.governorate}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.region')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.region}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.email')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.email}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.twitter_account')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.twitter_acount}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.website')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.website}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.website')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.website}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('partner_details.phone')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.phone}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Bank Information */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 4, mb: 2, fontWeight: theme.typography.fontWeightBold }}
                  >
                    {translate('partner_details.bank_information')}
                  </Typography>
                  <Grid container spacing={{ xs: 2 }} component="div">
                    {partnerDetails?.bank_informations && partnerDetails?.bank_informations.length
                      ? partnerDetails?.bank_informations.map((v, i) => (
                          <Grid item xs={12} md={6} key={i}>
                            <BankImageComp
                              enableButton={true}
                              bankName={`${v.bank_name}`}
                              accountNumber={`${v.bank_account_number}`}
                              bankAccountName={`${v.bank_account_name}`}
                            />
                          </Grid>
                        ))
                      : ''}
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  backgroundColor: 'white',
                  p: 3,
                  borderRadius: 1,
                  position: 'sticky',
                  width: '100%',
                  bottom: 24,
                  border: `1px solid ${theme.palette.grey[400]}`,
                }}
              >
                <Grid container spacing={2} alignItems="center" justifyContent="space-around">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="info"
                      endIcon={<Iconify icon="eva:edit-2-outline" />}
                    >
                      {translate('partner_details.submit_amendment_request')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="inherit"
                      endIcon={<Iconify icon="eva:message-circle-outline" />}
                    >
                      {translate('partner_details.send_messages')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="error">
                      {translate('delete_account')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary">
                      {translate('activate_account')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AccountPartnerDetails;

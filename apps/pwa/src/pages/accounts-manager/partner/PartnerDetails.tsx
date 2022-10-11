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
import { useQuery, useMutation } from 'urql';
import useAuth from 'hooks/useAuth';
import {
  detailsClientData,
  changeClientStatus,
  deleteClientData,
} from 'queries/account_manager/detailsClientData';
import { useSnackbar } from 'notistack';
//
import { PartnerDetailsProps } from '../../../@types/client_data';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';

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
  const { user } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // Routes
  const params = useParams();
  const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();

  const [resultDetailsClient, reexecuteDetailsClient] = useQuery({
    query: detailsClientData,
    variables: {
      id: params.partnerId as string,
    },
  });

  const { data, fetching, error } = resultDetailsClient;

  // Partner Details Data
  const [partnerDetails, setPartnerDetails] = useState<PartnerDetailsProps | null>(null);

  // Activate | Suspended Client
  const [activateResult, activateClient] = useMutation(changeClientStatus);
  const [suspendedResult, suspendedClient] = useMutation(changeClientStatus);
  const [deleteResult, deleteClient] = useMutation(deleteClientData);
  const [isSubmitting, setIsSubimitting] = useState(false);

  const handleActivateAccount = async (id: string) => {
    setIsSubimitting(true);

    const resActivate = await activateClient({
      pk_columns: {
        id: id,
      },
      _set: {
        status: 'ACTIVE_ACCOUNT',
      },
    });

    console.log('resActivate', resActivate);

    if (resActivate) {
      setIsSubimitting(false);
      enqueueSnackbar(
        `${translate('account_manager.partner_details.notification.activate_account')}`,
        {
          variant: 'success',
        }
      );
    }
  };

  const handeSuspendedAccount = async (id: string) => {
    setIsSubimitting(true);

    const resSuspended = await suspendedClient({
      pk_columns: {
        id: id,
      },
      _set: {
        status: 'SUSPENDED_ACCOUNT',
      },
    });

    console.log('resSuspended', resSuspended);

    if (resSuspended) {
      setIsSubimitting(false);
      enqueueSnackbar(
        `${translate('account_manager.partner_details.notification.disabled_account')}`,
        {
          variant: 'success',
        }
      );
    }
  };

  const handleDeleteAccount = async (email: string) => {
    setIsSubimitting(true);

    const resDeleted = await deleteClient({
      _set: {
        status: 'CANCELED_ACCOUNT',
      },
      email: {
        _eq: email,
      },
    });

    console.log('resDeleted', resDeleted);

    if (resDeleted) {
      setIsSubimitting(false);
      enqueueSnackbar(
        `${translate('account_manager.partner_details.notification.deleted_account')}`,
        {
          variant: 'success',
        }
      );
    }
  };

  useEffect(() => {
    if (data) {
      setPartnerDetails(data?.client_data_by_pk);
    }
  }, [data]);

  return (
    <Page title="Partner Details">
      <Container>
        <ContentStyle>
          {fetching && <Skeleton variant="rectangular" sx={{ height: 500, borderRadius: 2 }} />}
          {partnerDetails && (
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
                    <Typography variant="h4">{partnerDetails?.entity ?? '-'}</Typography>
                  </Box>
                </Box>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    ((!partnerDetails?.status ||
                      partnerDetails?.status === 'WAITING_FOR_ACTIVATION' ||
                      partnerDetails?.status === 'REVISED_ACCOUNT') &&
                      'warning') ||
                    (partnerDetails?.status === 'ACTIVE_ACCOUNT' && 'success') ||
                    'error'
                  }
                  sx={{ textTransform: 'capitalize', fontSize: 14, py: 2.5, px: 4 }}
                >
                  {(partnerDetails?.status === 'ACTIVE_ACCOUNT' &&
                    translate('account_manager.table.td.label_active_account')) ||
                    ((partnerDetails?.status === 'WAITING_FOR_ACTIVATION' ||
                      partnerDetails?.status === 'REVISED_ACCOUNT') &&
                      translate('account_manager.table.td.label_waiting_activation')) ||
                    (partnerDetails?.status !== 'waiting' &&
                      partnerDetails?.status !== 'approved' &&
                      translate('account_manager.table.td.label_canceled_account'))}
                </Label>
              </Stack>
              <Divider />
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  {/* Main Information */}
                  <Stack spacing={2} direction="column" component="div">
                    <Typography variant="h6">
                      {translate('account_manager.partner_details.main_information')}
                    </Typography>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.number_of_fulltime_employees')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.num_of_employed_facility ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.number_of_beneficiaries')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.num_of_beneficiaries ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.date_of_establishment')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.date_of_esthablistmen ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.headquarters')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.headquarters ?? '-'}
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
                      {translate('account_manager.partner_details.license_information')}
                    </Typography>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.license_number')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_number ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.entity_name_of_partner')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.entity ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.license_expiry_date')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_expired ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.license_issue_date')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_issue_date ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
                        {translate('account_manager.partner_details.license_file')}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                      >
                        {partnerDetails?.license_file ?? '-'}
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
                    {translate('account_manager.partner_details.administrative_data')}
                  </Typography>
                  <Grid container spacing={{ xs: 2 }} component="div">
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.ceo_name')}:
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
                          {translate('account_manager.partner_details.ceo_mobiles')}:
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
                          {translate('account_manager.partner_details.data_entry_name')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.data_entry_name ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.mobile_data_entry')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.data_entry_mobile ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.data_entry_mail')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.data_entry_mail ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Contact Information */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 4, mb: 2, fontWeight: theme.typography.fontWeightBold }}
                  >
                    {translate('account_manager.partner_details.contact_information')}
                  </Typography>
                  <Grid container spacing={{ xs: 2 }} component="div">
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.center_management')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.center_administration ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.governorate')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.governorate ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.region')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.region ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.email')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.email ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.twitter_account')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.twitter_acount ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.website')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.website ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.phone')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {partnerDetails?.phone ?? '-'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Bank Information */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 4, mb: 2, fontWeight: theme.typography.fontWeightBold }}
                  >
                    {translate('account_manager.partner_details.bank_information')}
                  </Typography>
                  <Grid container spacing={{ xs: 2 }} component="div">
                    {partnerDetails?.user &&
                    partnerDetails?.user?.bank_informations &&
                    partnerDetails?.user?.bank_informations.length ? (
                      partnerDetails?.user?.bank_informations.map((v, i) => (
                        <Grid item xs={12} md={6} key={i}>
                          <BankImageComp
                            enableButton={true}
                            bankName={`${v.bank_name}`}
                            accountNumber={`${v.bank_account_number}`}
                            bankAccountName={`${v.bank_account_name}`}
                          />
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12} md={6}>
                        -
                      </Grid>
                    )}
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
                    {partnerDetails?.status === 'ACTIVE_ACCOUNT' ? (
                      <Button
                        onClick={() => handeSuspendedAccount(partnerDetails?.id!)}
                        variant="contained"
                        color="warning"
                        disabled={isSubmitting}
                      >
                        {translate('account_manager.partner_details.btn_disabled_account')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleActivateAccount(partnerDetails?.id!)}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        {translate('account_manager.partner_details.btn_activate_account')}
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteAccount(user?.email)}
                    >
                      {translate('account_manager.partner_details.btn_deleted_account')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="inherit"
                      endIcon={<Iconify icon="eva:message-circle-outline" />}
                      onClick={() => navigate(PATH_ACCOUNTS_MANAGER.messages)}
                    >
                      {translate('account_manager.partner_details.send_messages')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="info"
                      endIcon={<Iconify icon="eva:edit-2-outline" />}
                      onClick={() =>
                        navigate(
                          PATH_ACCOUNTS_MANAGER.partnerSendAmandement(params.partnerId as string)
                        )
                      }
                    >
                      {translate('account_manager.partner_details.submit_amendment_request')}
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

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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import axiosInstance from '../../../utils/axios';
import ButtonDownloadFiles from '../../../components/button/ButtonDownloadFiles';
import { Conversation } from '../../../@types/wschat';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import uuidv4 from '../../../utils/uuidv4';
import { addConversation, setActiveConversationId } from '../../../redux/slices/wschat';

// -------------------------------------------------------------------------------

type UserStatus =
  | 'WAITING_FOR_ACTIVATION'
  | 'SUSPENDED_ACCOUNT'
  | 'CANCELED_ACCOUNT'
  | 'ACTIVE_ACCOUNT'
  | 'REVISED_ACCOUNT'
  | 'WAITING_FOR_EDITING_APPROVAL';
interface ChangeStatusRequest {
  status: UserStatus;
  user_id: string;
  selectLang: 'ar' | 'en';
}

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
  const { user, activeRole } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

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

  const [dynamicState, setDynamicState] = useState('');

  const { data, fetching, error } = resultDetailsClient;

  // Partner Details Data
  const [partnerDetails, setPartnerDetails] = useState<any>(null);

  // Activate | Suspended Client
  /* old gql */
  // const [activateResult, activateClient] = useMutation(changeClientStatus);
  const [suspendedResult, suspendedClient] = useMutation(changeClientStatus);
  const [deleteResult, deleteClient] = useMutation(deleteClientData);
  const [isSubmitting, setIsSubimitting] = useState(false);

  //Messages
  const dispatch = useDispatch();
  const { conversations } = useSelector((state: any) => state.wschat);

  /* old GQL */
  // const handleActivateAccount = async (id: string) => {
  //   setIsSubimitting(true);

  //   const resActivate = await activateClient({
  //     id: params.partnerId,
  //     _set: {
  //       status_id: 'ACTIVE_ACCOUNT',
  //     },
  //   });

  //   if (resActivate) {
  //     setDynamicState('ACTIVE_ACCOUNT');
  //     setIsSubimitting(false);
  //     enqueueSnackbar(
  //       `${translate('account_manager.partner_details.notification.activate_account')}`,
  //       {
  //         variant: 'success',
  //       }
  //     );
  //   }
  // };

  const handleChangeStatus = async (
    id: string,
    status: 'ACTIVE_ACCOUNT' | 'SUSPENDED_ACCOUNT' | 'CANCELED_ACCOUNT'
  ) => {
    setIsSubimitting(true);
    try {
      await axiosInstance.patch<ChangeStatusRequest, any>(
        '/tender-user/update-status',
        {
          status: status,
          user_id: id,
          selectLang: currentLang.value,
        } as ChangeStatusRequest,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      let notif = '';
      if (status === 'ACTIVE_ACCOUNT') {
        notif = 'account_manager.partner_details.notification.activate_account';
      } else if (status === 'SUSPENDED_ACCOUNT') {
        notif = 'account_manager.partner_details.notification.disabled_account';
      } else if (status === 'CANCELED_ACCOUNT') {
        notif = 'account_manager.partner_details.notification.deleted_account';
      }
      setDynamicState(status);
      setIsSubimitting(false);
      enqueueSnackbar(`${translate(notif)}`, {
        variant: 'success',
      });
    } catch (err) {
      setIsSubimitting(false);
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
        }
      );
      console.log(err);
    }
  };

  // const handeSuspendedAccount = async (id: string) => {
  //   setIsSubimitting(true);

  //   const resSuspended = await suspendedClient({
  //     id: params.partnerId,
  //     _set: {
  //       status_id: 'SUSPENDED_ACCOUNT',
  //     },
  //   });

  //   if (resSuspended) {
  //     setDynamicState('SUSPENDED_ACCOUNT');
  //     setIsSubimitting(false);
  //     enqueueSnackbar(
  //       `${translate('account_manager.partner_details.notification.disabled_account')}`,
  //       {
  //         variant: 'success',
  //       }
  //     );
  //   }
  // };

  // const handleDeleteAccount = async (email: string) => {
  //   setIsSubimitting(true);

  //   const resDeleted = await deleteClient({
  //     id: params.partnerId,
  //     _set: {
  //       status_id: 'CANCELED_ACCOUNT',
  //     },
  //   });

  //   if (resDeleted) {
  //     setDynamicState('CANCELED_ACCOUNT');
  //     setIsSubimitting(false);
  //     enqueueSnackbar(
  //       `${translate('account_manager.partner_details.notification.deleted_account')}`,
  //       {
  //         variant: 'success',
  //       }
  //     );
  //   }
  // };
  // console.log({ activeRole });
  const handleMessage = () => {
    const x = location.pathname.split('/');
    const urlToMessage = `/${x[1]}/${x[2]}/messages`;
    const activeRoleIndex: number = Number(localStorage.getItem('activeRoleIndex')) ?? 0;
    // console.log({ selectedRole });

    const valueToConversation: Conversation = {
      id: uuidv4(),
      correspondance_category_id: 'EXTERNAL',
      messages: [
        {
          content: null,
          attachment: null,
          content_title: null,
          content_type_id: 'TEXT',
          receiver_id: params.partnerId,
          owner_id: user?.id,
          // receiver_role_as: partnerDetails.client_data.user.roles[activeRoleIndex].role.id,
          receiver_role_as: `tender_${partnerDetails.client_data.user.roles[
            activeRoleIndex
          ].role.id.toLowerCase()}`,
          sender_role_as: activeRole!,
          created_at: moment().toISOString(),
          updated_at: moment().toISOString(),
          read_status: false,
          receiver: {
            employee_name: partnerDetails.employee_name,
          },
          sender: {
            employee_name: user?.firstName,
          },
        },
      ],
    };

    const valueNewConversation = conversations;
    let hasConversationId: string | undefined = undefined;

    if (valueNewConversation.length) {
      for (let index = 0; index < valueNewConversation.length; index++) {
        const { messages } = valueNewConversation[index];
        const findReceiverId = messages.find(
          (el: any) =>
            el.owner_id === valueToConversation.messages[0].receiver_id ||
            el.receiver_id === valueToConversation.messages[0].receiver_id
        );

        if (findReceiverId) {
          hasConversationId = valueNewConversation[index].id;
        }
      }
    }

    if (hasConversationId) {
      dispatch(setActiveConversationId(hasConversationId));
      handleReadMessages(hasConversationId);
      navigate(urlToMessage);
    } else {
      dispatch(addConversation(valueToConversation));
      dispatch(setActiveConversationId(valueToConversation.id!));
      handleReadMessages(valueToConversation.id!);
      navigate(urlToMessage);
    }
  };

  const handleReadMessages = async (conversationId: string) => {
    await axiosInstance.patch(
      '/tender/messages/toogle-read',
      {
        roomId: conversationId,
      },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  useEffect(() => {
    if (data) {
      setPartnerDetails(data?.user_by_pk);
      setDynamicState(data?.user_by_pk?.status_id);
    }
  }, [data]);
  // console.log({ partnerDetails });
  if (!data) return <>Loading...</>;
  return (
    // <Page title="Partner Details">
    <Page title={translate('pages.account_manager.partner_details')}>
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
                    <Typography variant="h4">
                      {(partnerDetails &&
                        partnerDetails?.client_data &&
                        partnerDetails?.client_data.entity) ??
                        '- No Data -'}
                    </Typography>
                  </Box>
                </Box>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    ((!dynamicState ||
                      dynamicState === 'WAITING_FOR_ACTIVATION' ||
                      dynamicState === 'REVISED_ACCOUNT') &&
                      'warning') ||
                    (dynamicState === 'ACTIVE_ACCOUNT' && 'success') ||
                    'error'
                  }
                  sx={{ textTransform: 'capitalize', fontSize: 14, py: 2.5, px: 4 }}
                >
                  {(dynamicState === 'ACTIVE_ACCOUNT' &&
                    translate('account_manager.table.td.label_active_account')) ||
                    ((dynamicState === 'WAITING_FOR_ACTIVATION' ||
                      dynamicState === 'REVISED_ACCOUNT') &&
                      translate('account_manager.table.td.label_waiting_activation')) ||
                    (dynamicState !== 'waiting' &&
                      dynamicState !== 'approved' &&
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.num_of_employed_facility) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.num_of_beneficiaries) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.date_of_esthablistmen) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.headquarters) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.license_number) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.entity) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.license_expired) ??
                          '- No Data -'}
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
                        {(partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.license_issue_date) ??
                          '- No Data -'}
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
                        {partnerDetails &&
                        partnerDetails?.client_data &&
                        partnerDetails?.client_data.license_file.url ? (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={partnerDetails?.client_data.license_file.url ?? '#'}
                          >
                            {translate('commons.view_license_file')}
                          </a>
                        ) : (
                          '- No Data -'
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="column" component="div" sx={{ mt: 4 }}>
                    <Typography variant="body1" component="p" sx={{ color: '#93A3B0', mb: 2 }}>
                      {translate('account_manager.partner_details.board_ofdec_file')}:
                    </Typography>
                    <Grid container spacing={2}>
                      {partnerDetails &&
                      partnerDetails?.client_data &&
                      partnerDetails?.client_data.board_ofdec_file &&
                      partnerDetails?.client_data.board_ofdec_file.length > 0 ? (
                        partnerDetails?.client_data.board_ofdec_file.map(
                          (item: any, index: number) => (
                            <Grid item xs={6} md={6} key={index}>
                              <ButtonDownloadFiles files={item} />
                            </Grid>
                          )
                        )
                      ) : (
                        <Grid item xs={6} md={6}>
                          {partnerDetails &&
                          partnerDetails?.client_data &&
                          partnerDetails?.client_data.board_ofdec_file ? (
                            <ButtonDownloadFiles
                              files={partnerDetails?.client_data.board_ofdec_file}
                            />
                          ) : (
                            <> {'- No Data -'} </>
                          )}
                        </Grid>
                      )}
                    </Grid>
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.ceo_name) ??
                            '- No Data -'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="column" alignItems="start">
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.ceo_mobile')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{
                            mt: 1,
                            fontWeight: theme.typography.fontWeightMedium,
                            direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
                          }}
                        >
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.ceo_mobile) ??
                            '- No Data -'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.chairman_name')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
                        >
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.chairman_name) ??
                            '- No Data -'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="column" alignItems="start">
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.chairman_mobile')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{
                            mt: 1,
                            fontWeight: theme.typography.fontWeightMedium,
                            direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
                          }}
                        >
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.chairman_mobile) ??
                            '- No Data -'}
                        </Typography>
                      </Stack>
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.data_entry_name) ??
                            '- No Data -'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="column" alignItems="start">
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.mobile_data_entry')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{
                            mt: 1,
                            fontWeight: theme.typography.fontWeightMedium,
                            direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
                          }}
                        >
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data?.data_entry_mobile) ??
                            '- No Data -'}
                        </Typography>
                      </Stack>
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.data_entry_mail) ??
                            '- No Data -'}
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.center_administration) ??
                            '- No Data -'}
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.governorate) ??
                            '- No Data -'}
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data?.region) ??
                            '- No Data -'}
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.email) ??
                            '- No Data -'}
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data?.twitter_acount) ??
                            '- No Data -'}
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
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data?.website) ??
                            '- No Data -'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} alignItems="start">
                      {/* <Box> */}
                      <Stack direction="column" alignItems="start">
                        <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                          {translate('account_manager.partner_details.phone')}:
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="p"
                          sx={{
                            mt: 1,
                            fontWeight: theme.typography.fontWeightMedium,
                            direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
                          }}
                        >
                          {(partnerDetails &&
                            partnerDetails?.client_data &&
                            partnerDetails?.client_data.phone) ??
                            '- No Data -'}
                        </Typography>
                      </Stack>
                      {/* </Box> */}
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
                    {partnerDetails?.bank_informations &&
                    partnerDetails?.bank_informations.length ? (
                      partnerDetails?.bank_informations.map((v: any, i: any) => (
                        <Grid item xs={12} md={6} key={i}>
                          <BankImageComp
                            enableButton={true}
                            bankName={`${v.bank_name}`}
                            accountNumber={`${v.bank_account_number}`}
                            bankAccountName={`${v.bank_account_name}`}
                            imageUrl={v?.card_image?.url}
                            size={v?.card_image?.size}
                            type={v?.card_image?.type}
                            borderColor={v?.color ?? 'transparent'}
                          />
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12} md={6}>
                        - No Data -
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
                    {dynamicState === 'ACTIVE_ACCOUNT' ? (
                      <Button
                        onClick={() => handleChangeStatus(partnerDetails?.id!, 'SUSPENDED_ACCOUNT')}
                        variant="contained"
                        color="warning"
                        disabled={isSubmitting}
                      >
                        {translate('account_manager.partner_details.btn_disabled_account')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleChangeStatus(params.partnerId!, 'ACTIVE_ACCOUNT')}
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
                      onClick={() => handleChangeStatus(user?.id!, 'CANCELED_ACCOUNT')}
                      disabled={dynamicState === 'CANCELED_ACCOUNT' ? true : false}
                    >
                      {translate('account_manager.partner_details.btn_deleted_account')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="inherit"
                      endIcon={<Iconify icon="eva:message-circle-outline" />}
                      // onClick={() => navigate(PATH_ACCOUNTS_MANAGER.messages)}
                      onClick={handleMessage}
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

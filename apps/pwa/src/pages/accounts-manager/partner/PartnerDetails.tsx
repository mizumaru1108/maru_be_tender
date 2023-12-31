import { useEffect, useState } from 'react';
// material
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
// components
import Iconify from 'components/Iconify';
import Label from 'components/Label';
import Page from 'components/Page';
// sections
import BankImageComp from 'sections/shared/BankImageComp';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { detailsClientData } from 'queries/account_manager/detailsClientData';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'urql';
//
import { FEATURE_PROJECT_DETAILS } from 'config';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Conversation } from '../../../@types/wschat';
import ButtonDownloadFiles from '../../../components/button/ButtonDownloadFiles';
import { ChangeStatusRequest } from '../../../components/table/TableRowsData';
import { addConversation, setActiveConversationId } from '../../../redux/slices/wschat';
import axiosInstance from '../../../utils/axios';
import uuidv4 from '../../../utils/uuidv4';
import ConfirmationModals from '../../../components/confirmation-modals';

// -------------------------------------------------------------------------------

// type UserStatus =
//   | 'WAITING_FOR_ACTIVATION'
//   | 'SUSPENDED_ACCOUNT'
//   | 'CANCELED_ACCOUNT'
//   | 'ACTIVE_ACCOUNT'
//   | 'REVISED_ACCOUNT';

type Action = 'ACTIVE_ACCOUNT' | 'SUSPENDED_ACCOUNT' | 'CANCELED_ACCOUNT' | 'DELETED';

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
  const partnerId = params.partnerId as string;
  const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();

  const [resultDetailsClient] = useQuery({
    query: detailsClientData,
    variables: {
      id: partnerId as string,
    },
  });

  const [dynamicState, setDynamicState] = useState('');

  const { data, fetching, error } = resultDetailsClient;

  // Partner Details Data
  const [partnerDetails, setPartnerDetails] = useState<any>(null);
  const [action, setAction] = useState<Action | null>(null);

  // Activate | Suspended Client
  const [isSubmitting, setIsSubimitting] = useState(false);

  //Messages
  const dispatch = useDispatch();
  const { conversations } = useSelector((state: any) => state.wschat);

  const handleChangeStatus = async (id: string, status: Action) => {
    setIsSubimitting(true);
    try {
      await axiosInstance.patch<ChangeStatusRequest, any>(
        '/tender-user/update-status',
        {
          status: status,
          user_id: [id],
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
        notif = 'account_manager.partner_details.notification.canceled_account';
      } else if (status === 'DELETED') {
        notif = 'account_manager.partner_details.notification.deleted_account';
      }
      setDynamicState(status);
      setIsSubimitting(false);
      enqueueSnackbar(`${translate(notif)}`, {
        variant: 'success',
      });
    } catch (err) {
      setIsSubimitting(false);
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(`${statusCode < 500 && message ? message : 'something went wrong!'}`, {
        variant: 'error',
      });
      console.log(err);
    } finally {
      navigate('/accounts-manager/dashboard/partner/management');
    }
  };

  const handleMessage = () => {
    const x = location.pathname.split('/');
    const urlToMessage = `/${x[1]}/${x[2]}/messages`;
    const activeRoleIndex: number = Number(localStorage.getItem('activeRoleIndex')) ?? 0;

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

  const handleOpenProjectOwnerDetails = () => {
    const submiterId = partnerId;
    const urls = location.pathname.split('/');
    navigate(`/${urls[1]}/dashboard/current-project/owner/${submiterId}`);
  };

  useEffect(() => {
    if (data) {
      setPartnerDetails(data?.user_by_pk);
      setDynamicState(data?.user_by_pk?.status_id);
    }
  }, [data]);

  if (!data) return <>Loading...</>;
  return (
    <Page title={translate('pages.account_manager.partner_details')}>
      <Container>
        <ContentStyle>
          {fetching && <Skeleton variant="rectangular" sx={{ height: 500, borderRadius: 2 }} />}
          {partnerDetails && (
            <>
              <Stack
                spacing={{ xs: 2, md: 4 }}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
                component="div"
                sx={{ width: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, md: 4 },
                  }}
                >
                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => navigate(-1)}
                    sx={{ padding: 1, minWidth: 25, minHeight: 25 }}
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
                    (dynamicState === 'DELETED' &&
                      translate('account_manager.table.td.label_deleted')) ||
                    (dynamicState !== 'waiting' &&
                      dynamicState !== 'approved' &&
                      translate('account_manager.table.td.label_canceled_account'))}
                </Label>
              </Stack>
              <Divider />
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6} key={index}>
                              <ButtonDownloadFiles files={item} />
                            </Grid>
                          )
                        )
                      ) : (
                        <Grid item xs={12} md={6}>
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
                    </Grid>
                    <Grid item xs={12} md={12} alignItems="start">
                      {/* <Box> */}
                      <Box sx={{ backgroundColor: '#fff', py: '30px', pl: '10px', mb: '15px' }}>
                        <Stack direction="column">
                          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                            {translate('project_owner_details.card_title')}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#1E1E1E',
                              fontSize: '12px',
                              mb: '5px',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={
                              FEATURE_PROJECT_DETAILS ? handleOpenProjectOwnerDetails : undefined
                            }
                          >
                            {translate('project_owner_details.card_href')}
                          </Typography>
                        </Stack>
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
                    {partnerDetails?.bank_informations &&
                    partnerDetails?.bank_informations.length ? (
                      partnerDetails?.bank_informations.map((v: any, i: any) => (
                        <Grid item xs={12} sm={6} key={i}>
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
              {dynamicState !== 'DELETED' && (
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
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent={{ xs: 'normal', sm: 'center', md: 'space-around' }}
                  >
                    <Grid item>
                      {dynamicState === 'ACTIVE_ACCOUNT' ? (
                        <Button
                          onClick={() =>
                            handleChangeStatus(partnerDetails?.id!, 'SUSPENDED_ACCOUNT')
                          }
                          variant="contained"
                          color="warning"
                          disabled
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
                        onClick={() => handleChangeStatus(partnerId || '', 'CANCELED_ACCOUNT')}
                        disabled={isSubmitting || dynamicState === 'CANCELED_ACCOUNT'}
                      >
                        {translate('account_manager.partner_details.btn_canceled_account')}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setAction('DELETED')}
                        disabled={isSubmitting}
                      >
                        {translate('account_manager.partner_details.btn_deleted_account')}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="inherit"
                        endIcon={<Iconify icon="eva:message-circle-outline" />}
                        onClick={handleMessage}
                      >
                        {translate('account_manager.partner_details.send_messages')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {action === 'DELETED' && (
                <ConfirmationModals
                  type="DELETED_ACCOUNT"
                  onSubmit={() => {
                    handleChangeStatus(partnerId || '', 'DELETED');
                  }}
                  onClose={() => setAction(null)}
                  partner_name={
                    (partnerDetails &&
                      partnerDetails?.client_data &&
                      partnerDetails?.client_data?.entity) ||
                    '- No Data -'
                  }
                  loading={isSubmitting}
                />
              )}
            </>
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AccountPartnerDetails;

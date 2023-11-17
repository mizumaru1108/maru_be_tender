import React from 'react';
import {
  Typography,
  Stack,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate } from 'react-router';
import { ProjectCardPropsBE } from './types';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { asignProposalToAUser } from 'queries/commons/asignProposalToAUser';
import { useMutation } from 'urql';
import { deleteDraftProposal } from 'queries/client/deleteDraftProposal';
import axiosInstance from '../../utils/axios';
import { LoadingButton } from '@mui/lab';
import { FEATURE_PROJECT_SAVE_DRAFT } from '../../config';
import { generateHeader } from '../../utils/generateProposalNumber';
import { useSnackbar } from 'notistack';
import { getProposalCount } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { setFiltered } from 'redux/slices/searching';

const RolesMap = {
  tender_finance: 'finance_id',
  tender_cashier: 'cashier_id',
  tender_project_manager: 'project_manager_id',
  tender_project_supervisor: 'supervisor_id',
  cluster_admin: '',
  tender_accounts_manager: '',
  tender_admin: '',
  tender_ceo: '',
  tender_client: '',
  tender_consultant: '',
  tender_moderator: '',
  tender_auditor_report: '',
  tender_portal_report: '',
};

const ProjectCardBE = ({
  id,
  inquiryStatus,
  project_name,
  project_number,
  updated_at,
  created_at,
  project_idea,
  user,
  proposal_logs,
  state,
  payments,
  outter_status: status,
  cardFooterButtonAction,
  track_id,
  support_outputs,
  destination, // it refers to the url that I came from and the url that I have to go to
  mutate,
  ...other
}: ProjectCardPropsBE) => {
  const { user: userAuth, activeRole } = useAuth();
  const role = activeRole!;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { translate } = useLocales();
  const [, updateAsigning] = useMutation(asignProposalToAUser);
  const [, deleteDrPro] = useMutation(deleteDraftProposal);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // redux
  const { track_list } = useSelector((state) => state.proposal);
  // selector for applicationAndAdmissionSettings
  const { application_admission_settings } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );

  function daysSinceCreated() {
    let getCreatedAt = new Date();
    if (updated_at) {
      getCreatedAt = new Date(updated_at);
    } else {
      getCreatedAt = new Date(created_at);
    }
    const daysSince = Math.ceil(
      (new Date().getTime() - getCreatedAt.getTime()) / (1000 * 3600 * 24) - 1
    );
    return daysSince;
  }

  const inquiryStatusStyle = {
    CANCELED: { color: '#FF4842', backgroundColor: '#FF484229', title: 'commons.chip_canceled' },
    PENDING_CANCELED: {
      color: '#FF4842',
      backgroundColor: '#FF484229',
      title: 'commons.chip_pending_canceled',
    },
    COMPLETED: { color: '#0E8478', backgroundColor: '#0E847829', title: 'commons.chip_completed' },
    PENDING: { color: '#FFC107', backgroundColor: '#FFC10729', title: 'commons.chip_pending' },
    ON_REVISION: {
      color: '#FFC107',
      backgroundColor: '#FFC10729',
      title: 'commons.chip_on_revision',
    },
    ASKED_FOR_AMANDEMENT: {
      color: '#FFC107',
      backgroundColor: '#FFC10729',
      title: 'commons.chip_asked_for_amandement',
    },
    ONGOING: {
      color: '#0E8478',
      backgroundColor: '#0E847829',
      title: 'commons.chip_ongoing',
    },
    ASKED_FOR_AMANDEMENT_PAYMENT: {
      color: '#FFC107',
      backgroundColor: '#FFC10729',
      title: 'commons.chip_asked_for_amandement_payment',
    },
  };

  const onDeleteDraftClick = async () => {
    setLoading(true);
    try {
      const rest = await axiosInstance.post(
        'tender-proposal/delete-draft',
        {
          proposal_id: id,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Draft has been deleted', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        mutate();
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onContinuingDraftClick = () => {
    navigate('/client/dashboard/funding-project-request', { state: { id } });
  };

  const handleNavigateToClientDetails = (id: string) => {
    const urls = location.pathname.split('/');
    const path = `/${urls[1]}/dashboard/current-project/owner/${id}`;
    navigate(path);
  };

  const handleUpdateAsigning = async () => {
    try {
      await updateAsigning({
        _set: {
          support_outputs: ['tender_project_supervisor'].includes(role) ? '-' : support_outputs,
          [`${RolesMap[role]!}`]: userAuth?.id,
          incoming: false,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      getProposalCount(role!);
    }
  };

  const handleOnClick = async () => {
    dispatch(setFiltered(''));
    try {
      if (
        [
          'tender_finance',
          'tender_cashier',
          'tender_project_manager',
          'tender_project_supervisor',
        ].includes(role) &&
        !['requests-in-process', 'previous-funding-requests'].includes(destination!)
      ) {
        if (
          (!other.project_manager_id && ['tender_project_manager'].includes(role)) ||
          (!other.finance_id && ['tender_finance'].includes(role)) ||
          (!other.cashier_id && ['tender_cashier'].includes(role)) ||
          (!other.supervisor_id && ['tender_project_supervisor'].includes(role))
        ) {
          handleUpdateAsigning();
        }
      }

      const x = location.pathname.split('/');
      if (!inquiryStatus) {
        if (destination) {
          if (['tender_ceo'].includes(activeRole!)) {
            const url = `/${
              x[1] + '/dashboard/project-management'
            }/${id}/${cardFooterButtonAction}`;
            navigate(url);
          } else {
            navigate(`/${x[1] + '/dashboard/' + destination}/${id}/${cardFooterButtonAction}`);
          }
        } else {
          navigate(`${location.pathname}/${id}/${cardFooterButtonAction}`);
        }
      } else {
        if (destination) {
          navigate(`/${x[1] + '/dashboard/' + destination}/${id}/reject-project`);
        } else {
          navigate(`${location.pathname}/${id}/reject-project`);
        }
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const formattedDateTime = (getDate: Date) => {
    const formattedDate = `${new Date(getDate).getDate()}.${
      new Date(getDate).getMonth() + 1
    }.${new Date(getDate).getFullYear()} ${translate(
      'project_management_headercell.at'
    )} ${new Date(getDate).getHours()}:${new Date(getDate).getMinutes()}`;

    return formattedDate;
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.common.white,
        '&:hover': { backgroundColor: theme.palette.grey[100], cursor: 'pointer' },
      }}
    >
      <CardContent
        onClick={(e: any) => {
          if (cardFooterButtonAction === 'draft') {
            return;
          } else {
            const elementId = e.target.id;
            if (elementId === 'userData' && user?.id && role !== 'tender_client') {
              handleNavigateToClientDetails(user?.id);
            } else {
              handleOnClick();
            }
          }
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent={{ xs: 'start', md: 'space-between' }}
          gap={{ xs: 1.5, sm: 2, md: 3, lg: 5 }}
          sx={{ mb: { xs: 3, md: 1 } }}
        >
          <Typography variant="h6" color="text.tertiary" sx={{ fontSize: '15px !important' }}>
            {(project_number && generateHeader(project_number)) ?? id}
          </Typography>
          {cardFooterButtonAction === 'draft' && (
            <Chip
              label={'مسودة'}
              sx={{
                fontWeight: 900,
                backgroundColor: '#1E1E1E29',
                borderRadius: '10px',
                display: 'flex',
                maxWidth: 'max-content',
              }}
            />
          )}
          {destination === 'previous-funding-requests' && status && (
            <Chip
              label={translate(
                `${
                  role === 'tender_client' &&
                  (status === 'PENDING_CANCELED' || status === 'PENDING')
                    ? inquiryStatusStyle.ONGOING.title
                    : inquiryStatusStyle[status].title
                }`
              )}
              sx={{
                fontWeight: 500,
                backgroundColor:
                  role === 'tender_client' &&
                  (status === 'PENDING_CANCELED' || status === 'PENDING')
                    ? inquiryStatusStyle.ONGOING.backgroundColor
                    : inquiryStatusStyle[status].backgroundColor,
                color:
                  role === 'tender_client' &&
                  (status === 'PENDING_CANCELED' || status === 'PENDING')
                    ? inquiryStatusStyle.ONGOING.color
                    : inquiryStatusStyle[status].color,
                borderRadius: '10px',
                display: 'flex',
                maxWidth: 'max-content',
              }}
            />
          )}
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 1.5,
            wordWrap: 'unset',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            maxWidth: '500px',
          }}
        >
          {project_name}
        </Typography>
        {project_idea && cardFooterButtonAction === 'draft' && (
          <Stack direction="column">
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              {translate('project_idea')}
            </Typography>
            <Typography
              sx={{
                mb: 1.5,
                wordWrap: 'unset',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '500px',
              }}
              color="#1E1E1E"
            >
              {project_idea}
            </Typography>
          </Stack>
        )}
        {user && (
          <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 'max-content' }}>
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              {translate('project_management_headercell.clients_name')}
            </Typography>
            <Typography
              id="userData"
              variant="h6"
              gutterBottom
              sx={{
                mb: 2,
                wordWrap: 'unset',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '500px',
                fontSize: '14px !important',
                cursor: user?.id && role !== 'tender_client' ? 'pointer' : undefined,
                '&:hover': {
                  textDecoration: user?.id && role !== 'tender_client' ? 'underline' : undefined,
                },
              }}
            >
              {(user && user.client_data && user.client_data.entity) ?? user.employee_name}
            </Typography>
          </Box>
        )}
        <Box component="div" sx={{ width: '100%' }}>
          <Grid container alignItems="start" spacing={{ xs: 2, md: 4 }}>
            {role !== 'tender_moderator' &&
            proposal_logs &&
            proposal_logs.length > 0 &&
            proposal_logs[proposal_logs.length - 1].reviewer ? (
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('project_management_headercell.employee')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {translate('project_management_headercell.sent_by')}{' '}
                  {proposal_logs[proposal_logs.length - 1].reviewer.employee_name}
                </Typography>
              </Grid>
            ) : null}
            {state ? (
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('project_management_headercell.sent_section')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {translate(`project_card.${state.toLowerCase()}`)}
                </Typography>
              </Grid>
            ) : null}
            {track_id && (
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('modal.headline.track')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {track_list.length > 0 && track_list.find((track: any) => track.id === track_id)
                    ? formatCapitalizeText(
                        track_list.find((track: any) => track.id === track_id)?.name || '-'
                      )
                    : '-'}
                </Typography>
              </Grid>
            )}
            {created_at && cardFooterButtonAction !== 'draft' && (
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('project_management_headercell.start_date')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {formattedDateTime(created_at)}
                </Typography>
              </Grid>
            )}

            {role !== 'tender_client' && (
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('appointments_headercell.action')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {(destination === 'requests-in-process' ||
                    destination === 'incoming-funding-requests') &&
                  role !== 'tender_finance' &&
                  role !== 'tender_cashier'
                    ? translate('need_review')
                    : destination === 'payment-adjustment' ||
                      destination === 'incoming-exchange-permission-requests' ||
                      destination === 'exchange-permission' ||
                      (destination === 'incoming-funding-requests' && role === 'tender_finance') ||
                      (destination === 'requests-in-process' && role === 'tender_finance')
                    ? translate('set_payment')
                    : (destination === 'incoming-funding-requests' && role === 'tender_cashier') ||
                      (destination === 'requests-in-process' && role === 'tender_cashier')
                    ? translate('set_payment_cashier')
                    : destination === 'project-report'
                    ? translate('close_report')
                    : destination === 'previous-funding-requests' && status === 'ONGOING'
                    ? translate('action_ongoing')
                    : destination === 'previous-funding-requests' && status === 'COMPLETED'
                    ? translate('action_completed')
                    : destination === 'previous-funding-requests' && status === 'CANCELED'
                    ? translate('account_manager.table.td.label_rejected')
                    : translate('need_review')}
                </Typography>
              </Grid>
            )}
            {role === 'tender_client' && (
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('appointments_headercell.action')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {destination === 'current-project'
                    ? translate('action_ongoing')
                    : destination === 'project-report'
                    ? translate('close_report')
                    : destination === 'previous-funding-requests' && status === 'ONGOING'
                    ? translate('action_ongoing')
                    : destination === 'previous-funding-requests' && status === 'COMPLETED'
                    ? translate('action_completed')
                    : destination === 'previous-funding-requests' && status === 'CANCELED'
                    ? translate('account_manager.table.td.label_rejected')
                    : translate('need_review')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        <Divider sx={{ marginTop: '30px' }} />
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'space-between', px: theme.spacing(3), pb: theme.spacing(3) }}
        onClick={(e: any) => {
          if (cardFooterButtonAction === 'draft') {
            return;
          } else {
            const elementId = e.target.id;
            if (elementId === 'userData' && user?.id && role !== 'tender_client') {
              handleNavigateToClientDetails(user?.id);
            } else {
              handleOnClick();
            }
          }
        }}
      >
        <Grid container spacing={2}>
          {payments && payments.length ? (
            <Grid container item md={12} columnSpacing={1}>
              {payments.map((payment: any, index: any) => (
                <Grid item key={index}>
                  <Typography
                    key={index}
                    color="#1E1E1E"
                    gutterBottom
                    sx={{
                      textDecorationLine: 'underline',
                      color: payment.status ? '#1E1E1E' : '#93A3B0',
                    }}
                  >
                    {payment.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="#93A3B0"
              gutterBottom
              sx={{ fontSize: '10px !important' }}
            >
              {translate('project_management_headercell.date_created')}
            </Typography>
            <Stack
              component="div"
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="#1E1E1E" sx={{ fontSize: '15px !important' }}>
                {updated_at ? moment(updated_at).format('LLLL') : moment(created_at).format('LLLL')}
              </Typography>
              {status !== 'COMPLETED' && (
                <Chip
                  label={`${daysSinceCreated()} ${
                    daysSinceCreated() < 2
                      ? translate('project_management_headercell.day')
                      : translate('project_management_headercell.days')
                  }`}
                  sx={{
                    alignSelf: 'end',
                    fontWeight: 500,
                    backgroundColor:
                      daysSinceCreated() >
                      application_admission_settings?.number_of_days_to_meet_business
                        ? '#FF484229'
                        : daysSinceCreated() >
                          application_admission_settings?.indicator_of_project_duration_days
                        ? '#FFC10729'
                        : '#0E84782E',
                    color:
                      daysSinceCreated() >
                      application_admission_settings?.number_of_days_to_meet_business
                        ? '#FF4842'
                        : daysSinceCreated() >
                          application_admission_settings?.indicator_of_project_duration_days
                        ? '#FFC107'
                        : '#0E8478',

                    borderRadius: '10px',
                  }}
                />
              )}
            </Stack>
            {cardFooterButtonAction === 'draft' ? (
              <Stack direction="row" alignItems="center" sx={{ mt: theme.spacing(2) }} gap={2}>
                <LoadingButton
                  loading={loading}
                  onClick={onContinuingDraftClick}
                  disabled={!FEATURE_PROJECT_SAVE_DRAFT}
                  startIcon={<img alt="" src="/icons/edit-pencile-icon.svg" />}
                  sx={{ backgroundColor: 'text.tertiary', color: '#fff' }}
                >
                  إكمال الطلب
                </LoadingButton>
                <LoadingButton
                  variant="outlined"
                  loading={loading}
                  disabled={!FEATURE_PROJECT_SAVE_DRAFT}
                  onClick={onDeleteDraftClick}
                  startIcon={<img alt="" src="/icons/trash-icon.svg" />}
                  sx={{
                    color: 'Red',
                    borderColor: 'Red',
                  }}
                >
                  حذف المسودة
                </LoadingButton>
              </Stack>
            ) : null}
          </Grid>
          {/* <Button
            variant="outlined"
            sx={{
              background: cardFooterButtonAction === 'show-project' ? '#fff' : '#0E8478',
              color: cardFooterButtonAction === 'show-project' ? '#1E1E1E' : '#fff',
              borderColor: cardFooterButtonAction === 'show-project' ? '#000' : undefined,
            }}
            onClick={handleOnClick}
          >
            {destination === 'requests-in-process'
              ? translate('continue_studying_the_project')
              : role === 'tender_client'
              ? translate('show_clients_project_detail')
              : translate(cardFooterButtonActionLocal[`${cardFooterButtonAction}`])}
          </Button> */}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProjectCardBE;

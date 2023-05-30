import React from 'react';
import {
  Typography,
  Stack,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Chip,
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

const cardFooterButtonActionLocal = {
  'show-project': 'show_project',
  'show-details': 'show_details',
  'completing-exchange-permission': 'completing_exchange_permission',
  draft: 'draft',
};

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
  destination, // it refers to the url that I came from and the url that I have to go to
  mutate,
}: ProjectCardPropsBE) => {
  // const daysSinceCreated = Math.ceil(
  //   (new Date().getTime() - created_at.getTime()) / (1000 * 3600 * 24)
  // );

  const { user: userAuth, activeRole } = useAuth();
  const role = activeRole!;
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLocales();
  const [, updateAsigning] = useMutation(asignProposalToAUser);
  const [, deleteDrPro] = useMutation(deleteDraftProposal);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // const urlArr: string[] = location.pathname.split('/');

  function daysSinceCreated() {
    let getCreatedAt = new Date();
    // if (updated_at && !urlArr.includes('previous-funding-requests')) {
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
  };

  const onDeleteDraftClick = async () => {
    // await deleteDrPro({ id });
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
      // console.log({ rest });
      if (rest) {
        enqueueSnackbar('Draft has been created', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        mutate();
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      // enqueueSnackbar(`Something went wrong ${err.message}`, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      // });
      // console.log(err);
      // handle error fetching
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

  const handleOnClick = async () => {
    if (
      ['tender_project_supervisor'].includes(role) &&
      destination !== 'requests-in-process' &&
      destination !== 'previous-funding-requests'
    ) {
      await updateAsigning({
        _set: {
          support_outputs: '-',
          [`${RolesMap[role]!}`]: userAuth?.id,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      });
    }

    if (
      [
        'tender_finance',
        'tender_cashier',
        'tender_project_manager',
        // 'tender_project_supervisor',
      ].includes(role) &&
      destination !== 'requests-in-process' &&
      destination !== 'previous-funding-requests'
    ) {
      await updateAsigning({
        _set: {
          [`${RolesMap[role]!}`]: userAuth?.id,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      });
    }
    if (destination) {
      const x = location.pathname.split('/');
      // console.log(`/${x[1] + '/' + x[2] + '/' + destination}/${id}/${cardFooterButtonAction}`);
      navigate(`/${x[1] + '/' + x[2] + '/' + destination}/${id}/${cardFooterButtonAction}`);
    } else {
      navigate(`${location.pathname}/${id}/${cardFooterButtonAction}`);
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
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        {/* The Title Section  */}
        <Stack direction="row" justifyContent="space-between" gap={5}>
          <Typography
            variant="h6"
            color="text.tertiary"
            gutterBottom
            sx={{ fontSize: '15px !important' }}
          >
            {(project_number && generateHeader(project_number)) ?? id}
          </Typography>
          {cardFooterButtonAction === 'draft' && (
            <Chip
              label={'مسودة'}
              sx={{ fontWeight: 900, backgroundColor: '#1E1E1E29', borderRadius: '10px' }}
            />
          )}
          {/* {role !== 'tender_moderator' &&
            proposal_logs &&
            proposal_logs.length > 0 &&
            proposal_logs.map((log: any) => {
              if (log.reviewer) {
                return (
                  <Stack>
                    <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                      {translate('project_management_headercell.employee')}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                      {translate('project_management_headercell.sent_by')}{' '}
                      {log.reviewer.employee_name}
                    </Typography>
                  </Stack>
                );
              } else {
                return null;
              }
            })} */}
          {destination === 'previous-funding-requests' && status && (
            <Chip
              label={translate(`${inquiryStatusStyle[status].title}`)}
              sx={{
                fontWeight: 500,
                backgroundColor: inquiryStatusStyle[status].backgroundColor,
                color: inquiryStatusStyle[status].color,
                borderRadius: '10px',
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
          <>
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
          </>
        )}
        {user && (
          <React.Fragment>
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              {translate('project_management_headercell.clients_name')}
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mb: 1.5,
                wordWrap: 'unset',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '500px',
                fontSize: '14px !important',
              }}
            >
              {(user && user.client_data && user.client_data.entity) ?? user.employee_name}
            </Typography>
          </React.Fragment>
        )}
        <Stack direction="row" gap={6}>
          {role !== 'tender_moderator' &&
            proposal_logs &&
            proposal_logs.length > 0 &&
            proposal_logs[proposal_logs.length - 1].reviewer && (
              <Stack>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('project_management_headercell.employee')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {translate('project_management_headercell.sent_by')}{' '}
                  {proposal_logs[proposal_logs.length - 1].reviewer.employee_name}
                </Typography>
              </Stack>
            )}
          {/* {role !== 'tender_moderator' &&
            proposal_logs &&
            proposal_logs.length > 0 &&
            proposal_logs.map((log: any) => {
              if (log.reviewer) {
                return (
                  <Stack>
                    <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                      {translate('project_management_headercell.employee')}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                      {translate('project_management_headercell.sent_by')}{' '}
                      {log.reviewer.employee_name}
                    </Typography>
                  </Stack>
                );
              } else {
                return null;
              }
            })} */}
          {state && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('project_management_headercell.sent_section')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                {translate(`project_card.${state.toLowerCase()}`)}
              </Typography>
            </Stack>
          )}
          {created_at && cardFooterButtonAction !== 'draft' && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('project_management_headercell.start_date')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                {formattedDateTime(created_at)}
                {/* {`${new Date(created_at)}`} */}
              </Typography>
            </Stack>
          )}

          {/* Action for employee */}
          {role !== 'tender_client' && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('appointments_headercell.action')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                {/* {translate(`project_card.${content.sentSection.toLowerCase()}`)} */}
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
            </Stack>
          )}
          {role === 'tender_client' && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('appointments_headercell.action')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                {/* {translate(`project_card.${content.sentSection.toLowerCase()}`)} */}
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
            </Stack>
          )}
        </Stack>
        <Divider sx={{ marginTop: '30px' }} />
      </CardContent>

      {/* The Footer Section  */}
      <CardActions sx={{ justifyContent: 'space-between', px: '30px' }}>
        <Grid container spacing={2}>
          {payments && (
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
          )}
          <Grid item md={12} xs={12} sx={{ marginBottom: '-10px' }}>
            <Typography
              variant="h6"
              color="#93A3B0"
              gutterBottom
              sx={{ fontSize: '10px !important' }}
            >
              {translate('project_management_headercell.date_created')}
            </Typography>
          </Grid>
          <Grid item md={6} xs={6}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="column">
                <Typography
                  variant="h6"
                  color="#1E1E1E"
                  gutterBottom
                  sx={{ fontSize: '15px !important' }}
                >
                  {updated_at
                    ? moment(updated_at).format('LLLL')
                    : moment(created_at).format('LLLL')}
                </Typography>
              </Stack>
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
                    daysSinceCreated() < 3
                      ? '#0E84782E'
                      : daysSinceCreated() < 5
                      ? '#FFC10729'
                      : '#FF484229',
                  color:
                    daysSinceCreated() < 3
                      ? '#0E8478'
                      : daysSinceCreated() < 5
                      ? '#FFC107'
                      : '#FF4842',
                  borderRadius: '10px',
                }}
              />
            </Stack>
          </Grid>
          <Grid item md={6} xs={6}>
            <Stack direction="row" justifyContent="end" gap={2}>
              {cardFooterButtonAction === 'draft' ? (
                <Stack direction="row" gap={2}>
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
                  <LoadingButton
                    loading={loading}
                    onClick={onContinuingDraftClick}
                    disabled={!FEATURE_PROJECT_SAVE_DRAFT}
                    startIcon={<img alt="" src="/icons/edit-pencile-icon.svg" />}
                    sx={{ backgroundColor: 'text.tertiary', color: '#fff' }}
                  >
                    إكمال الطلب
                  </LoadingButton>
                </Stack>
              ) : (
                <Button
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
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProjectCardBE;

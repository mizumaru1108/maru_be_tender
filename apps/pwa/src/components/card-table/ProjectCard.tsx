import {
  Typography,
  Stack,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Box,
  Grid,
  Chip,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate } from 'react-router';
import { ProjectCardProps } from './types';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { asignProposalToAUser } from 'queries/commons/asignProposalToAUser';
import { useMutation } from 'urql';
import { FusionAuthRoles } from '../../@types/commons';
import React from 'react';
import { dispatch, useSelector } from 'redux/store';
import { getProposalCount, getTrackList } from 'redux/slices/proposal';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import { setFiltered } from 'redux/slices/searching';

/**
 *
 * Todo: 1- starting with initializing the urql and having a query for the table.
 *       2- passing the paras as variables for the useQuesry.
 *       3- making the mutate.
 *       4- initializing the useQuery, useMutation.
 *       5- Finally, connecting everything with each other.
 */
const inquiryStatusStyle = {
  canceled: { color: '#FF4842', backgroundColor: '#FF484229' },
  pending_canceled: {
    color: '#FF4842',
    backgroundColor: '#FF484229',
    title: 'commons.chip_pending_canceled',
  },
  completed: { color: '#0E8478', backgroundColor: '#0E847829' },
  pending: { color: '#FFC107', backgroundColor: '#FFC10729' },
  on_revision: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  asked_for_amandement: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  asked_for_amandement_payment: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  ongoing: { color: '#0E8478', backgroundColor: '#0E847829' },
};

const cardFooterButtonActionLocal = {
  'show-project': 'show_project',
  'show-details': 'show_details',
  'completing-exchange-permission': 'completing_exchange_permission',
  'reject-project': 'reject-project',
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
  tender_auditor_report: '',
  tender_portal_report: '',
};
const ProjectCard = ({
  title,
  content,
  footer,
  cardFooterButtonAction,
  destination, // it refers to the url that I came from and the url that I have to go to
}: ProjectCardProps) => {
  const { user, activeRole } = useAuth();
  const role = activeRole!;
  const navigate = useNavigate();
  const location = useLocation();
  const { translate, currentLang } = useLocales();
  const [_, updateAsigning] = useMutation(asignProposalToAUser);
  const [action, setAction] = React.useState('');

  // Redux
  const { loadingProps } = useSelector((state) => state.proposal);
  const { application_admission_settings } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );
  // const valueLocale = localStorage.getItem('i18nextLng');

  // let daysSinceCreated = 0;
  // if (footer && footer.createdAt) {
  //   daysSinceCreated = Math.ceil(
  //     (new Date().getTime() - new Date(footer.createdAt).getTime()) / (1000 * 3600 * 24) - 1
  //   );
  // } else if (content && content.createdAtClient) {
  //   daysSinceCreated = Math.ceil(
  //     (new Date().getTime() - new Date(content.createdAtClient).getTime()) / (1000 * 3600 * 24) - 1
  //   );
  // }

  function daysSinceCreated() {
    let getCreatedAt = new Date();
    if (footer && footer.createdAt) {
      getCreatedAt = new Date(footer.createdAt);
    }
    const daysSince = Math.ceil(
      (new Date().getTime() - getCreatedAt.getTime()) / (1000 * 3600 * 24) - 1
    );
    return daysSince;
  }

  const onDeleteDraftClick = () => {
    console.log('onDeleteDraftClick');
  };

  const onContinuingDraftClick = () => {
    console.log('onContinuingDraftClick');
  };

  const handleOnClick = async () => {
    dispatch(setFiltered(''));
    if (['tender_project_supervisor'].includes(role) && destination !== 'requests-in-process') {
      await updateAsigning({
        _set: {
          support_outputs: '-',
        },
        where: {
          id: {
            _eq: title.id,
          },
        },
      });
    }

    if (
      [
        'tender_finance',
        'tender_cashier',
        'tender_project_manager',
        'tender_project_supervisor',
      ].includes(role) &&
      destination !== 'requests-in-process'
    ) {
      await updateAsigning({
        _set: {
          [`${RolesMap[role]!}`]: user?.id,
        },
        where: {
          id: {
            _eq: title.id,
          },
        },
      });
    }
    // dispatch(getProposalCount(activeRole ?? 'test'));
    if (FEATURE_PROPOSAL_COUNTING) {
      dispatch(getProposalCount(activeRole ?? 'test'));
    }
    const url = location.pathname.split('/');
    if (destination) {
      const tmp = `/${url[1]}/dashboard/${destination}/${title.id}/${cardFooterButtonAction}`;
      navigate(tmp);
    } else {
      if (url.includes('searching')) {
        const tmp = `/${url[1]}/dashboard/current-project/${title.id}/${cardFooterButtonAction}`;
        navigate(tmp);
      } else {
        navigate(`${location.pathname}/${title.id}/${cardFooterButtonAction}`);
      }
    }
  };
  React.useEffect(() => {
    if (title.inquiryStatus) {
      // console.log('title.inquiryStatus', title.inquiryStatus);
      if (
        (destination === 'incoming-funding-requests' ||
          destination === 'requests-in-process' ||
          destination === 'incoming-amandment-requests') &&
        role !== 'tender_finance' &&
        role !== 'tender_cashier'
      ) {
        setAction(translate('need_review'));
      } else if (destination === 'previous-funding-requests') {
        if (title.inquiryStatus === 'ongoing') {
          setAction(translate('action_ongoing'));
        } else if (
          title.inquiryStatus === 'asked_for_amandement' ||
          title.inquiryStatus === 'on_revision'
        ) {
          setAction(translate('need_review'));
        } else if (title.inquiryStatus === 'canceled') {
          setAction(translate('account_manager.table.td.label_rejected'));
        } else {
          setAction(translate('action_completed'));
        }
      } else if (
        (destination === 'incoming-funding-requests' && role === 'tender_finance') ||
        (destination === 'requests-in-process' && role === 'tender_finance') ||
        destination === 'payment-adjustment' ||
        destination === 'incoming-exchange-permission-requests' ||
        destination === 'exchange-permission'
      ) {
        setAction(translate('set_payment'));
      } else if (
        (destination === 'incoming-funding-requests' && role === 'tender_cashier') ||
        (destination === 'requests-in-process' && role === 'tender_cashier')
      ) {
        setAction(translate('set_payment_cashier'));
      } else if (destination === 'project-report') {
        setAction(translate('close_report'));
      }
    }
  }, [role, destination, translate, title.inquiryStatus]);

  if (loadingProps.laodingTrack) {
    return null;
  }
  // console.log('test', title);
  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        {/* The Title Section  */}
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="h6"
            color="text.tertiary"
            gutterBottom
            sx={{ fontSize: '15px !important' }}
          >
            {/* {title.id} */}
            {title.project_number ?? title.id}
          </Typography>
          {title && title.inquiryStatus && (
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor:
                  (role === 'tender_client' &&
                  (title.inquiryStatus === 'pending_canceled' || title.inquiryStatus === 'pending')
                    ? inquiryStatusStyle.ongoing.backgroundColor
                    : inquiryStatusStyle[title.inquiryStatus].backgroundColor) || '#fff',
                p: '5px',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color:
                    role === 'tender_client' &&
                    (title.inquiryStatus === 'pending_canceled' ||
                      title.inquiryStatus === 'pending')
                      ? inquiryStatusStyle.ongoing.color
                      : inquiryStatusStyle[title.inquiryStatus].color,
                  fontSize: '15px !important',
                  mb: '0px',
                }}
              >
                {translate(
                  `commons.chip_${
                    (title.inquiryStatus === 'pending_canceled' ||
                      title.inquiryStatus === 'pending') &&
                    role === 'tender_client'
                      ? 'ongoing'
                      : title.inquiryStatus
                  }`
                )}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* The Content Section  */}
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
          {content.projectName}
        </Typography>
        {content.organizationName && (
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
              {content.organizationName}
            </Typography>
          </React.Fragment>
        )}
        <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: '10px' }}>
          <Stack direction="column" gap={1}>
            {content.createdAt && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('project_management_headercell.date_created')}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {`${content.createdAt.getDate()}.${
                    content.createdAt.getMonth() + 1
                  }.${content.createdAt.getFullYear()} في ${content.createdAt.getHours()}:${content.createdAt.getMinutes()}`}
                  {/* {`${content.createdAt}`} */}
                </Typography>
              </>
            )}
            <Stack direction="row" gap={6}>
              {role !== 'tender_moderator' && content.employee && (
                <Stack>
                  <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                    {translate('project_management_headercell.employee')}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                    {translate('project_management_headercell.sent_by')} {content.employee}
                  </Typography>
                </Stack>
              )}
              {content.sentSection && (
                <Stack>
                  <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                    {translate('project_management_headercell.sent_section')}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                    {translate(`project_card.${content.sentSection.toLowerCase()}`)}
                  </Typography>
                </Stack>
              )}
              {content.createdAtClient && (
                <Stack>
                  <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                    {translate('project_management_headercell.start_date')}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                    {`${content.createdAtClient.getDate()}.${
                      content.createdAtClient.getMonth() + 1
                    }.${content.createdAtClient.getFullYear()} ${translate(
                      'project_management_headercell.at'
                    )} ${content.createdAtClient.getHours()}:${content.createdAtClient.getMinutes()}`}
                    {/* {`${content.createdAtClient}`} */}
                  </Typography>
                </Stack>
              )}
              {role !== 'tender_client' && destination !== 'previous-funding-requests' && (
                <Stack>
                  <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                    {translate('appointments_headercell.action')}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                    {/* {translate(`project_card.${content.sentSection.toLowerCase()}`)} */}
                    {action}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>

          {/* the project status */}
          {/* <Stack direction="column" gap={1} style={{ marginLeft: '100px' }}>
            {content.projectStatus && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  حالة المشروع
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {content.projectStatus}
                </Typography>
              </>
            )}
            {content.employee && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  الموظف
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {destination === 'requests-in-process'
                    ? user?.fullName
                    : translate('no_employee')}
                </Typography>
              </>
            )}
          </Stack> */}
        </Stack>
        <Stack direction="row" alignItems="center" gap={6} sx={{ marginBottom: '10px' }}>
          {content.projectDetails && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('project_details.heading')}
              </Typography>
              <Typography
                sx={{
                  mb: 0.5,
                  display: '-webkit-box',
                  '-webkit-line-clamp': 2,
                  'line-clamp': 2,
                  '-webkit-box-orient': 'vertical',
                }}
                color="#1E1E1E"
              >
                {content.projectDetails}
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
                  : destination === 'previous-funding-requests' && title.inquiryStatus === 'ongoing'
                  ? translate('action_ongoing')
                  : destination === 'previous-funding-requests' &&
                    title.inquiryStatus === 'completed'
                  ? translate('action_completed')
                  : destination === 'previous-funding-requests' &&
                    title.inquiryStatus === 'canceled'
                  ? translate('account_manager.table.td.label_rejected')
                  : translate('need_review')}
              </Typography>
            </Stack>
          )}
        </Stack>
        <Divider sx={{ marginTop: '30px' }} />
      </CardContent>

      {/* The Footer Section  */}
      <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
        <Grid container spacing={2}>
          {footer.payments && (
            <Grid container item md={12} columnSpacing={1}>
              {footer.payments.map((payment: any, index: any) => (
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
          <Grid item md={12}>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              <Stack direction="column">
                <Typography
                  variant="h6"
                  color="#93A3B0"
                  gutterBottom
                  sx={{ fontSize: '10px !important' }}
                >
                  {translate('project_management_headercell.date_created')}
                </Typography>
                <Typography
                  variant="h6"
                  color="#1E1E1E"
                  gutterBottom
                  sx={{ fontSize: '15px !important' }}
                >
                  {footer.createdAt
                    ? moment(footer.createdAt).locale(`${currentLang.value}`).format('LLLL')
                    : moment(content.createdAtClient).locale(`${currentLang.value}`).format('LLLL')}
                </Typography>
              </Stack>
              {content.projectStatus !== 'COMPLETED' && (
                <Chip
                  label={`${daysSinceCreated()} ${
                    daysSinceCreated() < 2
                      ? translate('project_management_headercell.day')
                      : translate('project_management_headercell.days')
                  }`}
                  sx={{
                    alignSelf: 'end',
                    fontWeight: 500,

                    // Old Handle
                    // backgroundColor:
                    //   daysSinceCreated() < 3
                    //     ? '#0E84782E'
                    //     : daysSinceCreated() < 5
                    //     ? '#FFC10729'
                    //     : '#FF484229',
                    // New Handle
                    backgroundColor:
                      daysSinceCreated() >
                      application_admission_settings?.number_of_days_to_meet_business
                        ? '#FF484229'
                        : daysSinceCreated() >
                          application_admission_settings?.indicator_of_project_duration_days
                        ? '#FFC10729'
                        : '#0E84782E',

                    // Old Handle
                    // color:
                    //   daysSinceCreated() < 3
                    //     ? '#0E8478'
                    //     : daysSinceCreated() < 5
                    //     ? '#FFC107'
                    //     : '#FF4842',
                    // New Handle
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
              {cardFooterButtonAction === 'draft' ? (
                <Stack direction="row" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={onDeleteDraftClick}
                    startIcon={<img alt="" src="/icons/trash-icon.svg" />}
                    sx={{
                      color: 'Red',
                      borderColor: 'Red',
                    }}
                  >
                    حذف المسودة
                  </Button>
                  <Button
                    onClick={onContinuingDraftClick}
                    startIcon={<img alt="" src="/icons/edit-pencile-icon.svg" />}
                    sx={{ backgroundColor: 'text.tertiary', color: '#fff' }}
                  >
                    إكمال الطلب
                  </Button>
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

export default ProjectCard;

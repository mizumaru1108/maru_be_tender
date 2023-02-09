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
  created_at,
  project_idea,
  user,
  state,
  payments,
  outter_status: status,
  cardFooterButtonAction,
  destination, // it refers to the url that I came from and the url that I have to go to
  mutate,
}: ProjectCardPropsBE) => {
  const daysSinceCreated = Math.ceil(
    (new Date().getTime() - created_at.getTime()) / (1000 * 3600 * 24)
  );
  const { user: userAuth, activeRole } = useAuth();
  const role = activeRole!;
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLocales();
  const [, updateAsigning] = useMutation(asignProposalToAUser);
  const [, deleteDrPro] = useMutation(deleteDraftProposal);
  const [loading, setLoading] = React.useState(false);

  const inquiryStatusStyle = {
    CANCELED: { color: '#FF4842', backgroundColor: '#FF484229', title: 'commons.chip_canceled' },
    COMPLETED: { color: '#0E8478', backgroundColor: '#0E847829', title: 'commons.chip_completed' },
    PENDING: { color: '#FFC107', backgroundColor: '#FFC10729', title: 'commons.chip_pending' },
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
      console.log({ rest });
      if (rest) {
        mutate();
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onContinuingDraftClick = () => {
    navigate('/client/dashboard/funding-project-request', { state: { id } });
  };

  const handleOnClick = async () => {
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
            {id}
          </Typography>
          {cardFooterButtonAction === 'draft' && (
            <Chip
              label={'مسودة'}
              sx={{ fontWeight: 900, backgroundColor: '#1E1E1E29', borderRadius: '10px' }}
            />
          )}
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
        {user.client_data.entity && (
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
              {user.client_data.entity}
            </Typography>
          </React.Fragment>
        )}
        <Stack direction="row" gap={6}>
          {role !== 'tender_moderator' && user.employee_name && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('project_management_headercell.employee')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                {user.employee_name}
              </Typography>
            </Stack>
          )}
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
          {user.client_data.created_at && cardFooterButtonAction !== 'draft' && (
            <Stack>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('project_management_headercell.start_date')}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                {`${new Date(user.client_data.created_at).getDay()}.${new Date(
                  user.client_data.created_at
                ).getMonth()}.${new Date(user.client_data.created_at).getFullYear()} ${translate(
                  'project_management_headercell.at'
                )} ${new Date(user.client_data.created_at).getHours()}:${new Date(
                  user.client_data.created_at
                ).getMinutes()}`}
                {/* {`${user.client_data.created_at}`} */}
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
                  {created_at
                    ? moment(created_at).format('LLLL')
                    : // ? `${footer.created_at.getDay()}.${footer.created_at.getMonth()}.${footer.created_at.getFullYear()} في ${footer.created_at.getHours()}:${footer.created_at.getMinutes()}`
                      '5 ساعات'}
                </Typography>
              </Stack>
              <Chip
                label={`${daysSinceCreated} ${translate('project_management_headercell.days')}`}
                sx={{
                  alignSelf: 'end',
                  fontWeight: 500,
                  backgroundColor:
                    daysSinceCreated < 3
                      ? '#0E84782E'
                      : daysSinceCreated < 5
                      ? '#FFC10729'
                      : '#FF484229',
                  color:
                    daysSinceCreated < 3 ? '#0E8478' : daysSinceCreated < 5 ? '#FFC107' : '#FF4842',
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

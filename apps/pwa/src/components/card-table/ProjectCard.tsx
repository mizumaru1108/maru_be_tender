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
  completed: { color: '#0E8478', backgroundColor: '#0E847829' },
  pending: { color: '#FFC107', backgroundColor: '#FFC10729' },
  on_revision: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  asked_for_amandement: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  ongoing: { color: '#0E8478', backgroundColor: '#0E847829' },
};

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
  // const valueLocale = localStorage.getItem('i18nextLng');

  let daysSinceCreated = 0;
  if (footer && footer.createdAt) {
    daysSinceCreated = Math.ceil(
      (new Date().getTime() - new Date(footer.createdAt).getTime()) / (1000 * 3600 * 24) - 1
    );
  } else if (content && content.createdAtClient) {
    daysSinceCreated = Math.ceil(
      (new Date().getTime() - new Date(content.createdAtClient).getTime()) / (1000 * 3600 * 24) - 1
    );
  }

  const onDeleteDraftClick = () => {
    console.log('onDeleteDraftClick');
  };

  const onContinuingDraftClick = () => {
    console.log('onContinuingDraftClick');
  };

  const handleOnClick = async () => {
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
        // 'tender_project_supervisor',
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
    if (destination) {
      const x = location.pathname.split('/');
      navigate(`/${x[1] + '/' + x[2] + '/' + destination}/${title.id}/${cardFooterButtonAction}`);
    } else {
      navigate(`${location.pathname}/${title.id}/${cardFooterButtonAction}`);
    }
  };

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
          {title.inquiryStatus && (
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: inquiryStatusStyle[title.inquiryStatus].backgroundColor,
                p: '5px',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: inquiryStatusStyle[title.inquiryStatus].color,
                  fontSize: '15px !important',
                  mb: '0px',
                }}
              >
                {translate(`outter_status.${title.inquiryStatus.toUpperCase()}`)}
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
        {content.projectDetails && (
          <>
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              {translate('project_details.heading')}
            </Typography>
            <Typography
              sx={{
                mb: 1.5,
                display: '-webkit-box',
                '-webkit-line-clamp': 2,
                'line-clamp': 2,
                '-webkit-box-orient': 'vertical',
              }}
              color="#1E1E1E"
            >
              {content.projectDetails}
            </Typography>
          </>
        )}
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
              <Chip
                label={`${daysSinceCreated} ${
                  daysSinceCreated < 2
                    ? translate('project_management_headercell.day')
                    : translate('project_management_headercell.days')
                }`}
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

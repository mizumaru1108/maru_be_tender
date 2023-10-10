import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { asignProposalToAUser } from 'queries/commons/asignProposalToAUser';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';
import { useMutation } from 'urql';
import { ClientCardProps } from './types';
/**
 *
 * Todo: 1- starting with initializing the urql and having a query for the table.
 *       2- passing the paras as variables for the useQuesry.
 *       3- making the mutate.
 *       4- initializing the useQuery, useMutation.
 *       5- Finally, connecting everything with each other.
 */
const statusStyle = {
  CANCELED_ACCOUNT: { color: '#FF4842', backgroundColor: '#FF484229' },
  DELETED: { color: '#FF4842', backgroundColor: '#FF484229' },
  ACTIVE_ACCOUNT: { color: '#0E8478', backgroundColor: '#0E847829' },
  SUSPENDED_ACCOUNT: { color: '#FFC107', backgroundColor: '#FFC10729' },
  WAITING_FOR_ACTIVATION: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  REVISED_ACCOUNT: { color: '#FFC107', backgroundColor: '#FFC10729' }, // this is the same as pending
  WAITING_FOR_EDITING_APPROVAL: { color: '#0E8478', backgroundColor: '#0E847829' },
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
const ClientCard = ({
  title,
  createdAt,
  email,
  employeeName,
  id,
  entityName,
  statusId,
  updatedAt,
  footer,
  cardFooterButtonAction,
  destination, // it refers to the url that I came from and the url that I have to go to
}: ClientCardProps) => {
  const { user, activeRole } = useAuth();
  const role = activeRole!;
  const navigate = useNavigate();
  const location = useLocation();
  const { translate, currentLang } = useLocales();
  const [_, updateAsigning] = useMutation(asignProposalToAUser);
  // const valueLocale = localStorage.getItem('i18nextLng');

  // const onDeleteDraftClick = () => {
  //   console.log('onDeleteDraftClick');
  // };

  // const onContinuingDraftClick = () => {
  //   console.log('onContinuingDraftClick');
  // };

  // const handleOnClick = async () => {
  //   if (
  //     [
  //       'tender_finance',
  //       'tender_cashier',
  //       'tender_project_manager',
  //       'tender_project_supervisor',
  //     ].includes(role) &&
  //     destination !== 'requests-in-process'
  //   ) {
  //     await updateAsigning({
  //       _set: {
  //         [`${RolesMap[role]!}`]: user?.id,
  //       },
  //       where: {
  //         id: {
  //           _eq: title.id,
  //         },
  //       },
  //     });
  //   }
  //   if (destination) {
  //     const x = location.pathname.split('/');
  //     navigate(`/${x[1] + '/' + x[2] + '/' + destination}/${title.id}/${cardFooterButtonAction}`);
  //   } else {
  //     navigate(`${location.pathname}/${title.id}/${cardFooterButtonAction}`);
  //   }
  // };

  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        {/* The Title Section  */}
        <Stack direction="row" justifyContent="flex-end">
          {title.statusId && (
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: statusStyle[title.statusId].backgroundColor,
                p: '5px',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: statusStyle[title.statusId].color,
                  fontSize: '15px !important',
                  mb: '0px',
                }}
              >
                {translate(`account_manager.table.td.label_${title.statusId.toLocaleLowerCase()}`)}
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" sx={{ justifyContent: 'flex-start', alignItems: 'center', pb: 3 }}>
          <PersonIcon sx={{ width: 200, height: 200, color: '#A4A4A4' }} />
          <Stack>
            {employeeName && (
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
                    flexWrap: 'nowrap',
                  }}
                >
                  {employeeName}
                </Typography>
              </React.Fragment>
            )}

            <React.Fragment>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                {translate('project_management_headercell.entity_name')}
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
                  flexWrap: 'nowrap',
                }}
              >
                {entityName || '-'}
              </Typography>
            </React.Fragment>

            {email && (
              <React.Fragment>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('email_label')}
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
                    flexWrap: 'nowrap',
                  }}
                >
                  {email}
                </Typography>
              </React.Fragment>
            )}

            {createdAt && (
              <React.Fragment>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  {translate('account_manager.table.th.createdAt')}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    mb: 1,
                    wordWrap: 'unset',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: '500px',
                    fontSize: '14px !important',
                  }}
                >
                  {`${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`}
                </Typography>
              </React.Fragment>
            )}
          </Stack>
        </Stack>
        <Divider />
      </CardContent>
      {/* The Footer Section  */}
      <CardActions sx={{ justifyContent: 'flex-end', px: 3, pb: 3 }}>
        {/* Actions  */}
        <Stack>
          <Button
            onClick={() => {
              navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string));
            }}
            variant="outlined"
            sx={{
              background: cardFooterButtonAction === 'show-project' ? '#fff' : '#0E8478',
              color: cardFooterButtonAction === 'show-project' ? '#1E1E1E' : '#fff',
              borderColor: cardFooterButtonAction === 'show-project' ? '#000' : undefined,
            }}
            // onClick={handleOnClick}
          >
            {translate(`account_manager.table.td.label_client_profile`)}
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ClientCard;

import PersonIcon from '@mui/icons-material/Person';
import { Grid, Card, CardContent, Stack, Typography, useTheme } from '@mui/material';
import Label from 'components/Label';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useNavigate } from 'react-router';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';
import { ClientCardProps } from './types';
import { setFiltered } from 'redux/slices/searching';
import { dispatch } from 'redux/store';

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
  const navigate = useNavigate();
  const { translate } = useLocales();
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.common.white,
        '&:hover': { backgroundColor: theme.palette.grey[100], cursor: 'pointer' },
      }}
    >
      <CardContent
        onClick={() => {
          dispatch(setFiltered(''));
          navigate(PATH_ACCOUNTS_MANAGER.partnerDetails(id as string));
        }}
      >
        {title.statusId && (
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Label
              color={
                (['CANCELED_ACCOUNT', 'DELETED', 'SUSPENDED_ACCOUNT'].includes(title.statusId) &&
                  'error') ||
                (['WAITING_FOR_ACTIVATION', 'REVISED_ACCOUNT'].includes(title.statusId) &&
                  'warning') ||
                'primary'
              }
              sx={{ fontSize: 14 }}
            >
              {translate(`account_manager.table.td.label_${title.statusId.toLocaleLowerCase()}`)}
            </Label>
          </Stack>
        )}

        <Grid container alignItems="center" spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={6} md={4}>
            <PersonIcon sx={{ width: '100%', height: 'auto', color: '#A4A4A4' }} />
          </Grid>
          <Grid item xs={6} md={8}>
            {employeeName ? (
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
            ) : null}

            {email ? (
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
            ) : null}

            {createdAt ? (
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
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ClientCard;

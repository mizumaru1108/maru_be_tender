import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import SummaryClientInfo from './SummaryClientInfo';
import { ProjectOwnerDetails } from '../../../@types/project-details';
import moment from 'moment';
import { getSummaryProjectOwner } from '../../../queries/client/getSummaryProjectOwner';
import { useQuery } from 'urql';
import CardTableByBE from '../../../components/card-table/CardTableByBE';

function ProjectOwnerDetailsMainPage() {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();
  const { submiterId } = useParams();

  const [userInfo, setUserInfo] = React.useState<ProjectOwnerDetails>({
    entity: 'maru',
    user: {
      email: 'maru@gmail.com',
    },
    phone: '01000000000',
    region: 'Indonesia',
    governorate: 'DKI Jakarta',
    center_administration: 'Jakarta Selatan',
    license_number: '123456789',
    license_issue_date: moment().format('YYYY-MM-DD'),
    headquarters: 'Jakarta',
  });

  const [result, _] = useQuery({
    query: getSummaryProjectOwner,
    variables: { id: submiterId },
  });

  const { fetching, data, error } = result;

  React.useEffect(() => {
    if (data) {
      setUserInfo(data.user_by_pk.client_data);
    }
    // eslint-disable-next-line
  }, [data, submiterId]);

  if (fetching) return <>Loading ....</>;

  if (error) return <>{error.message}</>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 1, minWidth: 35, minHeight: 25 }}
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
        <Typography
          variant="h4"
          sx={{
            maxWidth: '700px',
          }}
        >
          {translate('project_owner_details.client_details_header')}
        </Typography>
      </Stack>
      <SummaryClientInfo dataClient={userInfo} />
      <Divider sx={{ my: 3 }} />
      <CardTableByBE
        title={translate('project_owner_details.table_title') + userInfo.entity}
        destination="current-project"
        endPoint="tender/client/proposals"
        limitShowCard={6}
        cardFooterButtonAction="show-project"
        showPagination={true}
        addCustomFilter={{
          user_id: submiterId,
        }}
      />
    </Box>
  );
}

export default ProjectOwnerDetailsMainPage;

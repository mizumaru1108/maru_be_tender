import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
import CardTableBE from '../../../components/card-table/CardTableBE';
import { getOwnerProposals } from '../../../queries/commons/getProposal';
import SummaryClientInfo from './SummaryClientInfo';
import { ProjectOwnerDetails } from '../../../@types/project-details';
import moment from 'moment';
import { getSummaryProjectOwner } from '../../../queries/client/getSummaryProjectOwner';
import { useQuery } from 'urql';

function ProjectOwnerDetailsMainPage() {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();
  const { submiterId } = useParams();
  const location = useLocation();
  const url = location.pathname.split('/');
  // const destination = url[3] === 'current-project' ? url[3] : 'current-project';
  const destination = 'current-project';

  const [userInfo, setUserInfo] = React.useState<ProjectOwnerDetails>({
    entity: 'maru',
    // email: 'maru@gmail.com',
    user: {
      email: 'maru@gmail.com',
    },
    phone: '01000000000',
    region: 'Indonesia',
    governorate: 'DKI Jakarta',
    center_administration: 'Jakarta Selatan',
    license_number: '123456789',
    license_issue_date: moment().format('YYYY-MM-DD'),
  });

  const [result, _] = useQuery({
    query: getSummaryProjectOwner,
    variables: { id: submiterId },
  });

  const { fetching, data, error } = result;

  React.useEffect(() => {
    if (data) {
      // console.log('data', data.user_by_pk.client_data);
      setUserInfo(data.user_by_pk.client_data);
    }
  }, [data, submiterId]);

  if (fetching) return <>Loading ....</>;

  if (error) return <>{error.message}</>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
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
          {/* {proposal.project_name} */}
          {translate('project_owner_details.client_details_header')}
        </Typography>
      </Stack>
      <SummaryClientInfo dataClient={userInfo} />
      <Divider sx={{ marginTop: '30px' }} />
      <CardTableBE
        resource={getOwnerProposals}
        title={translate('project_owner_details.table_title') + userInfo.entity}
        cardFooterButtonAction="show-project"
        destination={destination as any}
        dateFilter={false}
        baseFilters={{
          submitter_user_id: { submitter_user_id: { _eq: submiterId } },
          // outter_status: { outter_status: { _neq: 'ONGOING' } },
        }}
      />
      {/* <ActionTap /> */}
      {/* <FloatinActonBar /> */}
    </Box>
  );
}

export default ProjectOwnerDetailsMainPage;

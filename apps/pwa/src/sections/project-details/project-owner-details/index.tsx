import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
import CardTableBE from '../../../components/card-table/CardTableBE';
import { getProposals } from '../../../queries/commons/getProposal';
import SummaryClientInfo from './SummaryClientInfo';

function ProjectOwnerDetailsMainPage() {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();
  const { submiterId } = useParams();
  const location = useLocation();
  const url = location.pathname.split('/');
  const destination = url[3];

  // React.useEffect(() => {
  //   console.log('destination URL', destination);
  // }, [url]);

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
      <SummaryClientInfo />
      <Divider sx={{ marginTop: '30px' }} />
      <CardTableBE
        resource={getProposals}
        title={translate('previous_support_requests')}
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

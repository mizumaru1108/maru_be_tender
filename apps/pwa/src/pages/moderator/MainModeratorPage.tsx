// material
import { Container, styled } from '@mui/material';
// components
import { CardInsight } from 'components/card-insight';
import Page from 'components/Page';
import { CardTable } from '../../components/card-table';
import { CardTableIncomingSupportRequests } from './mock-data';

// -------------------------------------------------------------------------------

const INSIGHT_DATA = [
  { title: 'rejected_pojects', value: 2 },
  { title: 'acceptable_projects', value: 2 },
  { title: 'pending_projects', value: 2 },
  { title: 'incoming_new_projects', value: 4 },
  { title: 'total_number_of_projects', value: 10 },
];

// -------------------------------------------------------------------------------

function MainManagerPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));
  console.log('adskadkla');
  return (
    <Page title="Manager Dashboard">
      <Container>
        <ContentStyle>
          <CardInsight headline="daily_stats" data={INSIGHT_DATA} />
          <CardTable
            data={CardTableIncomingSupportRequests} // For testing, later on we will send the query to it
            title="تلقي طلبات الدعم"
            pagination={false}
            // alphabeticalOrder={true} // optional
            // filters={[filter]} // optional
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;

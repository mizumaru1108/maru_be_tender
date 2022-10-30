import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingPreviousProposals } from 'queries/client/gettingPreviousProposals';

function PreviousFundingRequests() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={gettingPreviousProposals}
            title="طلبات دعم سابقة"
            dateFilter={true}
            cardFooterButtonAction="show-details"
            taps={{
              key: 'outter_status',
              options: [
                { label: 'كل المشاريع', value: 'COMPLETED' },
                { label: 'مشاريع منتهية', value: 'COMPLETED' },
                { label: 'مشاريع معلقة', value: 'PENDING' },
              ],
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

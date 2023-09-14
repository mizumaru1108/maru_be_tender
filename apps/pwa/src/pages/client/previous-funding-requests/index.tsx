import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTableByBE from 'components/card-table/CardTableByBE';
import Page from 'components/Page';
import useLocales from '../../../hooks/useLocales';

function PreviousFundingRequests() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100vw',
    maxHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    // <Page title="Previous Funding Requests">
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={gettingPreviousProposals}
            title="طلبات دعم سابقة"
            dateFilter={true}
            cardFooterButtonAction="show-project"
            taps={{
              key: 'outter_status',
              options: [
                {
                  label: 'كل المشاريع',
                  value: { outter_status: { _in: ['COMPLETED', 'PENDING'] } },
                },
                {
                  label: 'مشاريع منتهية',
                  value: { outter_status: { _in: ['COMPLETED'] } },
                },
                {
                  label: 'مشاريع معلقة',
                  value: { outter_status: { _in: ['PENDING'] } },
                },
              ],
            }}
            baseFilters={{
              step: { step: { _eq: 'ZERO' } },
              outter_status: { outter_status: { _neq: 'ONGOING' } },
            }}
            destination={'previous-funding-requests'}
          /> */}
          <CardTableByBE
            title={translate('previous_support_requests')}
            endPoint="tender-proposal/previous"
            destination="previous-funding-requests"
            limitShowCard={6}
            cardFooterButtonAction="show-project"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

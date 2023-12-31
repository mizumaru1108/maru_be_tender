import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { CardTable } from 'components/card-table';
import { IncomingConultationRequests } from 'pages/client/mock-data';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useLocales from '../../hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

function IncomingFundingRequests() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    // <Page title="incoming Funding Requests">
    <Page title={translate('pages.common.incoming_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={getProposals}
            title="طلبات الاستشارة الواردة"
            cardFooterButtonAction="show-details"
            alphabeticalOrder={true}
            filters={[
              {
                name: 'entity',
                title: 'اسم الجهة المشرفة',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'اسم المستخدم الأول', value: 'Essam Kayal' },
                  { label: 'اسم المستخدم الثاني', value: 'hisham' },
                  { label: 'اسم المستخدم الثالت', value: 'danang' },
                  { label: 'اسم المستخدم الرابع', value: 'yamen' },
                  { label: 'اسم المستخدم الخامس', value: 'hamdi' },
                ],
                generate_filter: (value: string) => ({
                  user: { client_data: { entity: { _eq: value } } },
                }),
              },
            ]}
            baseFilters={{
              filter1: {
                inner_status: { _eq: 'ACCEPTED_AND_NEED_CONSULTANT' },
                outter_status: { _nin: ['ASKED_FOR_AMANDEMENT', 'ON_REVISION'] },
              },
            }}
            destination={'incoming-funding-requests'}
          /> */}
          <CardTableByBE
            title={translate('incoming_support_requests')}
            destination="incoming-funding-requests"
            endPoint="tender-proposal/request-in-process"
            limitShowCard={6}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingFundingRequests;

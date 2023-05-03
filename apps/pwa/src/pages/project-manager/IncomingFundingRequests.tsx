import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function IncomingFundingRequests() {
  const { translate } = useLocales();
  const { user } = useAuth();

  return (
    // <Page title="Incoming Funding Requests | Project-Manager">
    <Page title={translate('pages.common.incoming_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={getProposals}
            title={translate('incoming_support_requests')}
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
                project_manager_id: { _is_null: true },
                _and: {
                  inner_status: { _in: ['ACCEPTED_BY_SUPERVISOR', 'ACCEPTED_BY_CONSULTANT'] },
                },
              },
            }}
            destination={'incoming-funding-requests'}
          /> */}
          <CardTableByBE
            title={translate('incoming_support_requests')}
            destination="requests-in-process"
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

import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function RequestsInProcess() {
  const { user } = useAuth();
  const { translate } = useLocales();
  return (
    // <Page title="Previous Funding Requests">
    <Page title={translate('pages.common.request_in_process')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={getProposals}
            title="طلبات قيد الاجراء"
            destination="requests-in-process"
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
              // inner_status: { inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' } },
              payments: { payments: { status: { _eq: 'accepted_by_project_manager' } } },
              finance_id: { finance_id: { _eq: user?.id } },
              outter_status: { outter_status: { _in: ['ONGOING', 'PENDING', 'ON_REVISION'] } },
            }}
            cardFooterButtonAction="completing-exchange-permission"
          /> */}
          <CardTableByBE
            title={translate('incoming_support_requests')}
            destination="requests-in-process"
            endPoint="tender-proposal/request-in-process"
            limitShowCard={6}
            cardFooterButtonAction="show-details"
            addCustomFilter={{
              vat: true,
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;

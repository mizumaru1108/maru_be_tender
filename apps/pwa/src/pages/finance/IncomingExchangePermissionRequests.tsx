import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { ProjectCardProps } from 'components/card-table/types';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useLocales from '../../hooks/useLocales';

function IncomingExchangePermissionRequests() {
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
    // <Page title="Incoming Exchange Permission Requests">
    <Page title={translate('pages.finance.incoming_exchange')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={getProposals}
            title="طلبات إذن الصرف الواردة"
            destination="incoming-exchange-permission-requests"
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
              finance_id: { finance_id: { _is_null: true } },
            }}
            cardFooterButtonAction="completing-exchange-permission"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingExchangePermissionRequests;

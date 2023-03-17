import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingIncomingRequests } from 'queries/project-supervisor/gettingIncomingRequests';
import useLocales from '../../hooks/useLocales';
import useAuth from 'hooks/useAuth';

function IncomingFundingRequests() {
  const { user } = useAuth();
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
    // <Page title="Incoming Funding Requests | Supervisor">
    <Page title={translate('pages.common.incoming_funding_requests')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={gettingIncomingRequests}
            title="طلبات الدعم الواردة"
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
            // baseFilters={{
            //   inner_status: { inner_status: { _eq: 'ACCEPTED_BY_MODERATOR' } },
            //   clasification_field: { clasification_field: { _is_null: true } },
            // }}
            // baseFilters={{
            //   filter1: {
            //     // supervisor_id: { _is_null: true },
            //     clasification_field: { _is_null: true },
            //     inner_status: {
            //       _nin: [
            //         'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
            //         'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
            //       ],
            //     },
            //     outter_status: { _neq: 'ON_REVISION' },
            //   },
            // }}
            baseFilters={{
              filter1: {
                // supervisor_id: { _eq: user?.id },
                clasification_field: { _is_null: true },
                inner_status: {
                  _eq: 'ACCEPTED_BY_MODERATOR',
                },
                outter_status: { _neq: 'ON_REVISION' },
              },
            }}
            destination={'incoming-funding-requests'}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingFundingRequests;

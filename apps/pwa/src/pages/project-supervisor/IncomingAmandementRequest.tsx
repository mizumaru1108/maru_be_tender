import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingPaymentAdjustment } from 'queries/project-supervisor/gettingPaymentAdjustment';
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

function IncomingAmandementRequest() {
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
    // <Page title="Previous Funding Requests">
    <Page title={translate('pages.common.incoming_amandement_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={gettingPaymentAdjustment}
            title="ضبط الدفعات"
            cardFooterButtonAction="completing-exchange-permission"
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
                supervisor_id: { _eq: user?.id },
                _or: [
                  {
                    inner_status: {
                      _in: ['ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION'],
                    },
                  },
                  { payments: { status: { _eq: 'set_by_supervisor' } } },
                ],
              },
            }}
            destination={'payment-adjustment'}
          /> */}
          <CardTableByBE
            title={translate('pages.common.incoming_amandement_requests')}
            endPoint="tender-proposal/amandement-request-lists"
            destination="incoming-amandment-requests"
            limitShowCard={6}
            cardFooterButtonAction="show-project"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingAmandementRequest;

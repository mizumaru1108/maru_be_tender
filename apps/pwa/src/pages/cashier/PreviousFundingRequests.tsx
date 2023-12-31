import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import CardTableByBE from '../../components/card-table/CardTableByBE';
import useLocales from '../../hooks/useLocales';

function PreviousFundingRequests() {
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
    // <Page title="طلبات الدعم سابقة">
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={gettingPreviousRequests}
            title="طلبات الدعم سابقة"
            cardFooterButtonAction="show-project"
            dateFilter={true}
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
              {
                name: 'status',
                title: 'الرجاء اختيار حالة المشروع',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'معلقة', value: 'PENDING' },
                  { label: 'مكتملة', value: 'COMPLETED' },
                  { label: 'ملغاة', value: 'CANCELED' },
                ],
                generate_filter: (value: string) => ({
                  outter_status: { _eq: value },
                }),
              },
            ]}
            destination={'previous-funding-requests'}
            // baseFilters={{
            //   inner_status: {
            //     inner_status: {
            //       _in: ['DONE_BY_CASHIER', 'PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'],
            //     },
            //   },
            //   _and: {
            //     _not: {
            //       payments: { payments: { status: { _in: ['accepted_by_finance'] } } },
            //     },
            //   },
            //   outter_status: { outter_status: { _in: ['COMPLETED', 'ONGOING'] } },
            // }}
            baseFilters={{
              filter1: {
                cashier_id: { _eq: user?.id },
                _or: [
                  {
                    inner_status: {
                      _in: ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'],
                    },
                    _not: {
                      payments: { status: { _in: paymentFilter } },
                    },
                  },
                  {
                    inner_status: {
                      _in: ['DONE_BY_CASHIER', 'PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'],
                    },
                    payments: { status: { _in: ['done'] } },
                  },
                ],
              },
            }}
          /> */}
          <CardTableByBE
            title={translate('previous_support_requests')}
            endPoint="tender-proposal/previous"
            destination="previous-funding-requests"
            limitShowCard={6}
            cardFooterButtonAction="show-project"
            sorting={['sorting', 'project_name', 'project_status', 'range_date', 'client_name']}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

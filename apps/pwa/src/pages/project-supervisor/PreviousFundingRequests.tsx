import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import CardTableByBE from '../../components/card-table/CardTableByBE';
import useLocales from '../../hooks/useLocales';

function PreviousFundingRequests() {
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
            //   outter_status: { outter_status: { _neq: 'ONGOING' } },
            // }}
            baseFilters={{
              filter1: {
                // support_outputs: { _is_null: false },
                supervisor_id: { _eq: user?.id },
                _not: {
                  inner_status: {
                    _in: [
                      'CREATED_BY_CLIENT',
                      'ACCEPTED_BY_MODERATOR',
                      'REJECTED_BY_MODERATOR',
                      'DONE_BY_CASHIER',
                      'ASKING_SUPERVISOR_CHANGES',
                      'ASKING_PROJECT_SUPERVISOR_CHANGES',
                      'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
                    ],
                  },
                },
                _or: {
                  _not: {
                    payments: { status: { _in: ['set_by_supervisor'] } },
                  },
                },
                // payments: { status: { _in: ['ACCEPTED_BY_SUPERVISOR','accepted_by_project_manager','accepted_by_finance'] } },
                // inner_status: {
                //   _in: [
                //     'ACCEPT_BY_SUPERVISOR',
                //     'accepted_by_project_manager',
                //     'ACCEPTED_BY_CEO',
                //     'DONE_BY_CASHIER',
                //     'ACCEPTED_AND_NEED_CONSULTANT',
                //   ],
                // },
                // outter_status: {
                //   _in: [
                //     'ON_REVISION',
                //     'ASKED_FOR_AMANDEMENT',
                //     'ONGOING',
                //     'PENDING',
                //     'CANCELED',
                //     'COMPLETED',
                //   ],
                // },
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

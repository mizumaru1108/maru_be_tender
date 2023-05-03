import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
import CardTableByBE from '../../components/card-table/CardTableByBE';

function PreviousFundingRequests() {
  const { user } = useAuth();
  const { translate } = useLocales();

  const INNER_STATUS_FILTER = [
    'ACCEPTED_BY_PROJECT_MANAGER',
    'REJECTED_BY_PROJECT_MANAGER',
    'REVISED_BY_PROJECT_MANAGER',
    'ASKING_PROJECT_MANAGER_CHANGES',
    'ACCEPTED_BY_CEO',
    'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
    'REJECTED_BY_CEO',
    'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
    'ACCEPTED_BY_FINACE',
    'DONE_BY_CASHIER',
    'ACCEPTED_AND_NEED_CONSULTANT',
    'REJECTED_BY_CONSULTANT',
    'PROJECT_COMPLETED',
  ];

  const OUTTER_STATUS_FILTER = [
    'ON_REVISION',
    'ASKED_FOR_AMANDEMENT',
    'ONGOING',
    'CANCELED',
    'COMPLETED',
  ];

  // const PAYMENTS_FILTER = ['ACCEPTED_BY_PROJECT_MANAGER', 'ACCEPTED_BY_FINANCE', 'DONE'];

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    // <Page title="Previous Funding Requests | Project-Manager">
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={getProposals}
            title={translate('pages.common.previous_funding_requests')}
            cardFooterButtonAction="show-project"
            destination="previous-funding-requests"
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
            // baseFilters={{
            //   filter1: {
            //     project_manager_id: { _is_null: true },
            //   },
            // }}
            baseFilters={{
              filter1: {
                inner_status: {
                  _in: [
                    'ACCEPTED_BY_CEO',
                    'REJECTED_BY_CEO',
                    'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
                    'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
                    'DONE_BY_CASHIER',
                    'REQUESTING_CLOSING_FORM',
                    'PROJECT_COMPLETED',
                  ],
                },
              },
            }}
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

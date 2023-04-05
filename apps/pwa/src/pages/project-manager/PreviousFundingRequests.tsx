import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';

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
    // <Page title="Previous Funding Requests | Project-Manager">
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          <CardTableBE
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
                project_manager_id: { _eq: user?.id },
                _not: {
                  inner_status: {
                    _in: [
                      'CREATED_BY_CLIENT',
                      'ACCEPTED_BY_MODERATOR',
                      'REJECTED_BY_MODERATOR',
                      'ACCEPTED_BY_SUPERVISOR',
                      'REJECTED_BY_SUPERVISOR',
                      'ASKING_PROJECT_MANAGER_CHANGES',
                      'REVISED_BY_PROJECT_MANAGER',
                      'ASKING_PROJECT_MANAGER_CHANGES',
                    ],
                  },
                },
                _or: {
                  _not: {
                    payments: { status: { _in: ['issued_by_supervisor'] } },
                  },
                },
                // inner_status: {
                //   _in: INNER_STATUS_FILTER,
                // },
                // outter_status: { _in: OUTTER_STATUS_FILTER },
                // payments: { status: { _in: PAYMENTS_FILTER } },
              },
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

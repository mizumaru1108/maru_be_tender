import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingPreviousRequests } from 'queries/project-supervisor/gettingPreviousRequests';
import { getProposals } from 'queries/commons/getProposal';
import useLocales from '../../hooks/useLocales';
import useAuth from 'hooks/useAuth';
import CardTableByBE from '../../components/card-table/CardTableByBE';

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
            //   payments: { payments: { status: { _in: ['accepted_by_finance', 'done'] } } },
            // }}
            baseFilters={{
              filter1: {
                finance_id: { _eq: user?.id },
                _and: [{ payments: { status: { _in: ['accepted_by_finance', 'done'] } } }],
                _not: { payments: { status: { _in: ['accepted_by_project_manager'] } } },
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

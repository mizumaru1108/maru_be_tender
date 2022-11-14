import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { CardTable } from 'components/card-table';
import { data1 } from './mockData';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';

function PreviousFundingRequests() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Previous Funding Requests | Project-Manager">
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={getProposals}
            title="طلبات الدعم سابقة"
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
            baseFilters={{
              filter1: {
                project_manager_id: { _eq: 'null' },
              },
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

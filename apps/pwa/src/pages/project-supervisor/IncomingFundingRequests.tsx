import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingIncomingRequests } from 'queries/project-supervisor/gettingIncomingRequests';

function IncomingFundingRequests() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Incoming Funding Requests | Supervisor">
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
            baseFilters={{
              filter1: { supervisor_id: { _eq: 'null' } },
            }}
            destination={'incoming-funding-requests'}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingFundingRequests;

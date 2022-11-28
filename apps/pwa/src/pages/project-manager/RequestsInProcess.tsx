import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useAuth from 'hooks/useAuth';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function RequestsInProcess() {
  const { user } = useAuth();

  return (
    <Page title="Requests in Proccess | Project-Manager">
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={getProposals}
            title="طلبات قيد الإجراء"
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
              filter1: {
                project_manager_id: { _eq: user?.id },
                _and: { inner_status: { _eq: 'ACCEPTED_BY_SUPERVISOR' } },
              },
            }}
            destination={'incoming-funding-requests'}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;

import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { CardTable } from 'components/card-table';
import { data } from './mockData';

function RequestsInProcess() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={data} // For testing, later on we will send the query to it
            title="طلبات قيد الإجراء"
            cardFooterButtonAction="show-details"
            alphabeticalOrder={true}
            filters={[
              { name: 'اسم الجهة المشرفة*', options: [{ label: 'اسم الجهة المشرفة*', value: '' }] },
            ]}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;

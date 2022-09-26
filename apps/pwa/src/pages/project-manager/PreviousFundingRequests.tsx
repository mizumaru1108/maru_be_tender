import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { CardTable } from 'components/card-table';
import { data1 } from './mockData';

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
    <Page title="طلبات الدعم سابقة">
      <Container>
        <ContentStyle>
          <CardTable
            data={data1} // For testing, later on we will send the query to it
            title="طلبات الدعم سابقة"
            cardFooterButtonAction="show-project"
            dateFilter={true}
            filters={[
              { name: 'اسم الجهة المشرفة*', options: [{ label: 'اسم الجهة المشرفة*', value: '' }] },
            ]}
            taps={['اسم الجمعية المختارة', 'اسم الجمعية المختارة', 'حالة المشروع المختارة']}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

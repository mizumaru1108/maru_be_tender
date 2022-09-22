import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import { CardTableDataPrevious } from '../mock-data';
import { filterInterface } from '../../../components/card-table/types';

function SupportRequestsReceived() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  const filter: filterInterface = {
    name: 'filter',
    options: [
      {
        label: 'filter1',
        value: 'a to z',
      },
    ],
  };

  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={CardTableDataPrevious} // For testing, later on we will send the query to it
            title="تلقي طلبات الدعم"
            alphabeticalOrder={true} // optional
            filters={[filter]} // optional
            taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default SupportRequestsReceived;

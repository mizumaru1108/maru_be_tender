import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { filterInterface, ProjectCardProps } from 'components/card-table/types';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import axiosInstance from 'utils/axios';
import { CardTableSearching } from '../components/card-table';
import useLocales from '../hooks/useLocales';
import { useSelector } from 'redux/store';
import CardSearching from 'components/card-table/searching/CardSearching';

function PreviousSupportRequests() {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { sort, filtered } = useSelector((state) => state.searching);
  const [supportRequests, setSupportRequests] = useState<ProjectCardProps[]>([]);
  const [data, setData] = useState([]);

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    // <Page title="Searching Page">
    <Page title={translate('pages.common.search')}>
      <Container>
        <ContentStyle>
          {/* <CardTableSearching
            data={supportRequests} // For testing, later on we will send the query to it
            title="نتيجة البحث"
            // dateFilter={true}
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-project"
          /> */}
          <CardSearching
            title={translate('pages.common.search')}
            cardFooterButtonAction="show-project"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;

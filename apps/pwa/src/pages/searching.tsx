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
import NewCardTable from 'components/card-table/NewCardTable';

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

  const DATA_URL = '/tender-user/find-users';

  const HEADERS = { 'x-hasura-role': activeRole! };

  // const { data } = await axiosInstance.get('/tender-user/find-users', {
  //   params: {
  //     employee_name: 'Marumaru',
  //   },
  //   headers: { 'x-hasura-role': activeRole! },
  // });
  // if (data.statusCode === 200) {
  //   console.log({ data });
  // }

  return (
    <Page title={translate('pages.common.search')}>
      <Container>
        <ContentStyle>
          {activeRole !== 'tender_accounts_manager' ? (
            <CardSearching
              title={translate('pages.common.search')}
              cardFooterButtonAction="show-project"
            />
          ) : (
            <NewCardTable
              title={translate('pages.common.search')}
              cardFooterButtonAction="show-project"
              url={DATA_URL}
              headersProps={HEADERS}
            />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;

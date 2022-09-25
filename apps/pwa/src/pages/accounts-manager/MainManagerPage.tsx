// material
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import { CardInsight } from 'components/card-insight';
import { TableAMCustom } from 'components/table';
// mock
import { AM_NEW_REQUEST, AM_UPDATE_REQUEST } from './mock-data';
//
import { PATH_ACCOUNTS_MANAGER } from '../../routes/paths';

// -------------------------------------------------------------------------------

const INSIGHT_DATA = [
  { title: 'number_of_request', value: 57 },
  { title: 'active_partners', value: 14 },
  { title: 'rejected', value: 2 },
  { title: 'suspended_partners', value: 1 },
];

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// -------------------------------------------------------------------------------

function MainManagerPage() {
  return (
    <Page title="Manager Dashboard">
      <Container>
        <ContentStyle>
          <CardInsight headline="daily_stats" data={INSIGHT_DATA} />
          <TableAMCustom
            data={AM_NEW_REQUEST}
            headline="new_join_request"
            view_all={PATH_ACCOUNTS_MANAGER.newJoinRequest}
          />
          <TableAMCustom
            data={AM_UPDATE_REQUEST}
            headline="info_update_request"
            view_all={PATH_ACCOUNTS_MANAGER.infoUpdateRequest}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;

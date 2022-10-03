import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import MessagesPage from '../../components/message';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  justifyContent: 'start',
  flexDirection: 'column',
}));

function ModeratorMessages() {
  return (
    <Page title="Messages">
      <ContentStyle>
        <MessagesPage />
      </ContentStyle>
    </Page>
  );
}

export default ModeratorMessages;

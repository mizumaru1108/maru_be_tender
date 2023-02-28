import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import MessagesPage from '../../components/message';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  justifyContent: 'start',
  flexDirection: 'column',
}));

function ModeratorMessages() {
  const { translate } = useLocales();
  return (
    // <Page title="Messages">
    <Page title={translate('pages.common.messages')}>
      <ContentStyle>
        <MessagesPage />
      </ContentStyle>
    </Page>
  );
}

export default ModeratorMessages;

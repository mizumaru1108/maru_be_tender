import { styled } from '@mui/material';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';
import GetAuthCode from '../../sections/project-supervisor/appintments-with-partner/GetAuthCode';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function RedirectAuthCodeMeetinh() {
  const { translate } = useLocales();
  return (
    // <Page title="Messages">
    <Page title={translate('pages.common.messages')}>
      <ContentStyle>
        <GetAuthCode />
      </ContentStyle>
    </Page>
  );
}

export default RedirectAuthCodeMeetinh;

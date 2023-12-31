import { Box, Container, styled } from '@mui/material';
import Page from 'components/Page';
import { FEATURE_MENU_ADMIN_MOBILE_SETTINGS } from '../../../config';
import useLocales from '../../../hooks/useLocales';
import MobileSettingsForm from '../../../sections/admin/mobile-settings/MobileSettingsForm';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function Form() {
  const { translate } = useLocales();

  // get id from url params
  // const params = useParams();
  // const id = params?.id;

  return (
    // <Page title="Mobile Settings">
    <Page title={translate('pages.common.mobile_settings')}>
      <Container>
        <ContentStyle>
          <Box sx={{ px: '30px' }}>
            {FEATURE_MENU_ADMIN_MOBILE_SETTINGS && <MobileSettingsForm />}
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default Form;

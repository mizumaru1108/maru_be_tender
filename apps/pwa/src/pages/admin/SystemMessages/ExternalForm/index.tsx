import { Container, styled } from '@mui/material';
import Page from 'components/Page';
import { FEATURE_BANNER } from 'config';
import useLocales from 'hooks/useLocales';
import AdvertisingExternalForm from '../../../../sections/admin/system-messges/form/external';

function AdvertisingExternalPage() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 40,
  }));

  return (
    // <Page title="System Messages">
    <Page title={translate('pages.admin.advertising_external_form')}>
      <Container>
        <ContentStyle>{FEATURE_BANNER && <AdvertisingExternalForm />}</ContentStyle>
      </Container>
    </Page>
  );
}

export default AdvertisingExternalPage;

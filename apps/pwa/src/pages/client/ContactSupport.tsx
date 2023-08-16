import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import ContactSupportForm from 'sections/client/contact-and-support/ContactSupportForm';
import useLocales from '../../hooks/useLocales';
import { FEATURE_CONTACT_US_BY_CLIENT } from '../../config';

const ContactSupport = () => {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));
  return (
    // <Page title="Contact And Support">
    <Page title={translate('pages.client.contact_and_support')}>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              {translate('pages.client.contact_and_support')}
            </Typography>
          </Box>
          <Container
            sx={{
              px: {
                md: '150px',
              },
            }}
          >
            {FEATURE_CONTACT_US_BY_CLIENT ? <ContactSupportForm /> : null}
          </Container>
        </ContentStyle>
      </Container>
    </Page>
  );
};

export default ContactSupport;

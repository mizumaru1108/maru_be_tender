import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import ContactSupportForm from 'sections/client/contact-and-support/ContactSupportForm';
import { FEATURE_CONTACT_US_BY_CLIENT } from '../../config';

const ContactSupport = () => {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));
  return (
    <Page title="Contact And Support">
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              تواصل معنا
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

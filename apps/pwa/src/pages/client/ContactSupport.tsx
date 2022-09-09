import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import ContactSupportForm from 'sections/client/contact-and-support/ContactSupportForm';

const ContactSupport = () => {
  const SectionStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '500px',
    backgroundColor: theme.palette.background.neutral,
  }));

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));
  return (
    <Page title="Fundin Project Request">
      <SectionStyle />
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
            <ContactSupportForm />
          </Container>
        </ContentStyle>
      </Container>
    </Page>
  );
};

export default ContactSupport;

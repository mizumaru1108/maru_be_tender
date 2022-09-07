import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import FundingProjectRequestForm from 'sections/@dashboard/funding-project-request/FundingProjectRequestForm';

const FundingProjectRequest = () => {
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
      {/* <Container> */}
      <ContentStyle>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            إنشاء طلب دعم جديد
          </Typography>
        </Box>
        <FundingProjectRequestForm />
      </ContentStyle>
      {/* </Container> */}
    </Page>
  );
};

export default FundingProjectRequest;

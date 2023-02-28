import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import FundingProjectRequestForm from 'sections/client/funding-project-request';
import useLocales from '../../hooks/useLocales';

const FundingProjectRequest = () => {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));

  return (
    // <Page title="Fundin Project Request">
    <Page title={translate('pages.common.funding_requests')}>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              إنشاء طلب دعم جديد
            </Typography>
          </Box>
          <FundingProjectRequestForm />
        </ContentStyle>
      </Container>
    </Page>
  );
};

export default FundingProjectRequest;

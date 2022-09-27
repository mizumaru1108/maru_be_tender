// material
import { Container, styled, Typography, Button, Stack } from '@mui/material';
// components
import Page from 'components/Page';
import Iconify from 'components/Iconify';
// hooks
import { useParams, useNavigate } from 'react-router-dom';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 20,
}));

// -------------------------------------------------------------------------------

function AccountPartnerDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const partnerName = params.partnerName as string;

  console.log('params', partnerName);

  return (
    <Page title="Partner Details">
      <Container>
        <ContentStyle>
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ padding: 1, minWidth: 25, minHeight: 25 }}
            >
              <Iconify icon={'eva:arrow-ios-forward-outline'} width={25} height={25} />
            </Button>
          </Stack>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AccountPartnerDetails;

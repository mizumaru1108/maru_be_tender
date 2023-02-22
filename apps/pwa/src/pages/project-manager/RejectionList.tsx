import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoRejectionList from '../../sections/ceo/ceo-rejection-list';

function RejectionList() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Project Manager - Rejection List">
      <Container>
        <ContentStyle>
          <CeoRejectionList />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RejectionList;

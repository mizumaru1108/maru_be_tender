import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoRejectionList from '../../sections/ceo/ceo-rejection-list';
import useLocales from '../../hooks/useLocales';
import CeoProjectRejects from 'sections/ceo/ceo-project-rejects';

function RejectionList() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    // <Page title="Project Manager - Rejection List">
    <Page title={translate('pages.common.rejection_list')}>
      <Container>
        <ContentStyle>
          {/* <CeoRejectionList /> */}
          <CeoProjectRejects />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RejectionList;

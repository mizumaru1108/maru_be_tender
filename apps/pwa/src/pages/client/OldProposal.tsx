import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoClientList from '../../sections/ceo/ceo-clientlist';
import useLocales from '../../hooks/useLocales';
import OldProposalTable from '../../components/table/old-proposal/OldProposalTable';

function OldProposalPage() {
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
    // <Page title="Ceo Client List Page | Ceo">
    <Page title={translate('pages.common.old_proposal')}>
      <Container>
        <ContentStyle>
          <OldProposalTable />
          {/* Under constraction ... */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default OldProposalPage;

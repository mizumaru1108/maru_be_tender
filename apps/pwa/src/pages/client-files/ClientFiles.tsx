import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import RHFNestedRepeater from 'sections/client/funding-project-request/forms/TestingNestedFrom';
import ClientFilesTable from '../../components/table/client-files/ClientFilesTable';
import useLocales from '../../hooks/useLocales';

function ClientFiles() {
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
    <Page title={translate('pages.common.old_proposal')}>
      <Container>
        <ContentStyle>
          <ClientFilesTable />
          {/* <RHFNestedRepeater /> */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ClientFiles;

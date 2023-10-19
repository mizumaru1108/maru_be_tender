import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingMyRequestedProcess } from 'queries/project-supervisor/gettingMyRequestedProcess';
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

function RequestsInProcess() {
  const { user } = useAuth();
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
    // <Page title="Requests In Process | Supervisor">
    <Page title={translate('pages.common.request_in_process')}>
      <Container>
        <ContentStyle>
          <CardTableByBE
            title={translate('pages.common.request_in_process')}
            destination="requests-in-process"
            endPoint="tender-proposal/request-in-process"
            limitShowCard={6}
            cardFooterButtonAction="show-details"
            typeRequest="inprocess"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;

import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import CardTableByBE from '../../components/card-table/CardTableByBE';
import useLocales from '../../hooks/useLocales';

function IncomingExchangePermissionRequestsWithVat() {
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
    <Page title={translate('pages.finance.incoming_exchange')}>
      <Container>
        <ContentStyle>
          <CardTableByBE
            title={translate('previous_support_requests')}
            endPoint="tender-proposal/payment-adjustment"
            destination="incoming-exchange-permission-requests"
            limitShowCard={6}
            cardFooterButtonAction="completing-exchange-permission"
            addCustomFilter={'&vat=false'}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingExchangePermissionRequestsWithVat;

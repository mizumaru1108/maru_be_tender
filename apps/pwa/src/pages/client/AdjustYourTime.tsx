import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { AdjustClentAvailableTime } from 'sections/client/appointments/adjust-your-time';
import useLocales from '../../hooks/useLocales';
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100%',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function AdjustYourTime() {
  const { translate } = useLocales();
  return (
    // <Page title="Adjust Your Time">
    <Page title={translate('pages.client.adjust_time')}>
      <Container>
        <ContentStyle>
          <AdjustClentAvailableTime />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AdjustYourTime;

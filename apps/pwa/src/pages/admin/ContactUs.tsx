import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import useLocales from '../../hooks/useLocales';
import OldProposalTable from '../../components/table/old-proposal/OldProposalTable';
import { ContactSupportTable } from '../../components/table/admin/contact-us';
import { FEATURE_CONTACT_US_BY_CLIENT } from '../../config';

function ContactUsPage() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 10,
  }));

  return (
    <Page title={translate('contact_support_title')}>
      <Container>
        <ContentStyle>
          {/* Under constraction ... */}
          {FEATURE_CONTACT_US_BY_CLIENT ? <ContactSupportTable /> : null}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ContactUsPage;

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import FundingProjectRequestForm from 'sections/client/funding-project-request';
import ProposalDisableModal from '../../components/modal-dialog/ProposalDisableModal';
import { FEATURE_DISABLE_PROPOSAL_DATE } from '../../config';
import { hasDayExpired } from '../../utils/checkIsExpired';

const FundingProjectRequest = () => {
  const { translate } = useLocales();
  const isOpen =
    FEATURE_DISABLE_PROPOSAL_DATE && hasDayExpired({ expiredDate: FEATURE_DISABLE_PROPOSAL_DATE })
      ? false
      : !FEATURE_DISABLE_PROPOSAL_DATE
      ? false
      : true;
  // console.log({ isOpen });
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));

  return (
    // <Page title="Funding Project Requests">
    <Page title={translate('pages.common.funding_requests')}>
      <Container>
        <ContentStyle>
          <ProposalDisableModal
            open={isOpen}
            message={translate('modal.disable_proposal.message')}
          />
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              {translate('create_a_new_support_request')}
            </Typography>
          </Box>
          <FundingProjectRequestForm />
        </ContentStyle>
      </Container>
    </Page>
  );
};

export default FundingProjectRequest;

import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { gettingSavedProjects } from 'queries/client/gettingSavedProjects';
import CardTableBE from 'components/card-table/CardTableBE';
import useLocales from '../../../hooks/useLocales';
import { hasDayExpired } from '../../../utils/checkIsExpired';
import ProposalDisableModal from '../../../components/modal-dialog/ProposalDisableModal';
import { FEATURE_DISABLE_PROPOSAL_DATE } from '../../../config';

function DraftsFundingRequest() {
  const { translate } = useLocales();
  const isOpen =
    FEATURE_DISABLE_PROPOSAL_DATE && hasDayExpired({ expiredDate: FEATURE_DISABLE_PROPOSAL_DATE })
      ? false
      : !FEATURE_DISABLE_PROPOSAL_DATE
      ? false
      : true;
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    maxHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    // <Page title="Draft Funding Requests">
    <Page title={translate('pages.client.draft_funding_requests')}>
      <Container>
        <ContentStyle>
          <ProposalDisableModal
            open={isOpen}
            message={[translate('modal.disable_proposal.message')]}
          />
          <CardTableBE
            resource={gettingSavedProjects}
            title="طلبات دعم مسودة"
            alphabeticalOrder={true}
            cardFooterButtonAction="draft" // The most important param
            baseFilters={{
              step: {
                step: {
                  _neq: 'ZERO',
                },
              },
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default DraftsFundingRequest;

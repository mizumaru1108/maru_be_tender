import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { gettingSavedProjects } from 'queries/client/gettingSavedProjects';
import CardTableBE from 'components/card-table/CardTableBE';

function DraftsFundingRequest() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Draft Funding Requests">
      <Container>
        <ContentStyle>
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

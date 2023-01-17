import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import ProjectOwnerDetailsMainPage from 'sections/project-details/project-owner-details';

function ProjectOwnerDetails() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Client Profile">
      <Container>
        <ContentStyle>
          <ProjectOwnerDetailsMainPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ProjectOwnerDetails;

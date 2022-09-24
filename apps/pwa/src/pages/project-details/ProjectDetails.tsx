import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import ProjectDetailsMainPage from 'sections/project-details';

function ProjectDetails() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <ProjectDetailsMainPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ProjectDetails;

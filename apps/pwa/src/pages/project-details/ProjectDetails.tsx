import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import ProjectDetailsMainPage from 'sections/project-details';

/**
 *
 * 1- getting the id, buttonAction from the URL.
 * 2- getting the data of the project-id from the back.
 * 3- getting the role from the LocalStorage.
 * 4- making the tap buttons as a component, and pass to it the Allowed buttons based on the role itself.
 * 5- defining every button component as a separate component from the base one.
 * 6- making the action-bar at the end of the page as a dynamic component based on the role.
 * 7- defining every button of the action-bar's handleOnClick.
 */
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

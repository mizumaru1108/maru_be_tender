import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import ProjectOwnerDetailsMainPage from '../../sections/project-details/project-owner-details/ProjectOwnerDetailsMainPage';
import { useParams } from 'react-router';
import DetailClientInfo from '../../sections/project-details/project-owner-details/DetailClientInfo';
import useLocales from '../../hooks/useLocales';

function ProjectOwnerDetails() {
  const { translate } = useLocales();
  const params = useParams();
  const detailType = params.detailType ?? null;
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    // <Page title="Client Profile">
    <Page title={translate('pages.project_details.owner_details')}>
      <Container>
        <ContentStyle>
          {!detailType && <ProjectOwnerDetailsMainPage />}
          {detailType === 'details' && <DetailClientInfo />}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ProjectOwnerDetails;

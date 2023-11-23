import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import { useParams } from 'react-router';
import useLocales from '../../hooks/useLocales';
import DetailClientInfo from '../../sections/project-details/project-owner-details/DetailClientInfo';
import ProjectOwnerDetailsMainPage from '../../sections/project-details/project-owner-details/ProjectOwnerDetailsMainPage';

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

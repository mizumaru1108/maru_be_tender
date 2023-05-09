import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoProjectManagement from '../../sections/ceo/ceo-project-management';
import useLocales from '../../hooks/useLocales';
import { dispatch, useSelector } from 'redux/store';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { getTrackList } from 'redux/slices/proposal';

function CeoProjectManagementPage() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    // <Page title="Project Management">
    <Page title={translate('pages.ceo.project_management')}>
      <Container>
        <ContentStyle>
          <CeoProjectManagement />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default CeoProjectManagementPage;

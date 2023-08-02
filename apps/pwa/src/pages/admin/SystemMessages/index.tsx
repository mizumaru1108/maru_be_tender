import { Container, styled } from '@mui/material';
import { FEATURE_BANNER } from 'config';
import React from 'react';
import SystemMessages from 'sections/admin/system-messges';
import Page from '../../../components/Page';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import { getTrackList } from '../../../redux/slices/proposal';
import { dispatch } from '../../../redux/store';

function SystemMessagesPage() {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 40,
  }));

  // React.useEffect(() => {
  //   dispatch(getTrackList(1, activeRole! as string));
  // }, [activeRole]);

  return (
    // <Page title="System Messages">
    <Page title={translate('pages.admin.system_messages')}>
      <Container>
        <ContentStyle>{FEATURE_BANNER && <SystemMessages />}</ContentStyle>
      </Container>
    </Page>
  );
}

export default SystemMessagesPage;

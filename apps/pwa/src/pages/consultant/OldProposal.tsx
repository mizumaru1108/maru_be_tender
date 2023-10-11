import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import useLocales from '../../hooks/useLocales';
import OldProposalTable from '../../components/table/old-proposal/OldProposalTable';
import useAuth from 'hooks/useAuth';
import { dispatch, useSelector } from 'redux/store';
import React from 'react';
import { getTrackList } from 'redux/slices/proposal';

function OldProposalPage() {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { loadingProps } = useSelector((state) => state.proposal);

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  React.useEffect(() => {
    dispatch(getTrackList(0, activeRole! as string));
  }, [activeRole]);

  if (loadingProps.laodingTrack) return <>{translate('pages.common.loading')}</>;

  return (
    <Page title={translate('pages.common.old_proposal')}>
      <Container>
        <ContentStyle>
          <OldProposalTable />
          {/* Under constraction ... */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default OldProposalPage;

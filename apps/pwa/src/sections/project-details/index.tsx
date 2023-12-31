import { Box, Button, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router';
import ActionTap from './ActionTap';
import FollowUpsAction from './follow-ups/FollowUpsAction';
import React from 'react';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import ProjectStatus from './ProjectStatus';
import FloatinActonBar from './floating-action-bar/FloatinActonBar';
import {
  getBeneficiariesList,
  getProposal,
  getRegionList,
  getTrackList,
} from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
//
import { FEATURE_PROJECT_DETAILS } from 'config';
import useAuth from 'hooks/useAuth';
import AmandementProposalDialog from '../client/funding-project-request/AmandementProposalDialog';
import { getTracksById } from '../../redux/slices/track';
import moment from 'moment';

function ProjectDetailsMainPage() {
  const { id, actionType } = useParams();

  const dispatch = useDispatch();

  const location = useLocation();

  const { activeRole } = useAuth();
  const role = activeRole!;

  const { translate, currentLang } = useLocales();

  const { proposal, isLoading, error, loadingCount } = useSelector((state) => state.proposal);
  const { isLoading: load } = useSelector((state) => state.tracks);

  const navigate = useNavigate();

  const handlePreviewPrint = () => {
    const x = location.pathname.split('/');
    const url = `/${x[1] + '/' + x[2] + '/'}current-project/preview/${id}`;
    navigate(url);
  };

  const handleFetching = React.useCallback(async () => {
    await dispatch(getProposal(id as string, role as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // dispatch(getProposal(id as string, role as string));
    handleFetching();
    // getTrackList
    dispatch(getBeneficiariesList(role!, false));
    dispatch(getTrackList(0, role as string));
    dispatch(getRegionList());
  }, [dispatch, id, role, handleFetching]);

  React.useEffect(() => {
    if (proposal?.track_id && proposal?.track_id !== 'test') {
      dispatch(getTracksById(role!, proposal?.track_id || ''));
    }
  }, [dispatch, proposal, role]);

  if (isLoading || loadingCount) return <>... Loading</>;

  if (error) return <>{error}</>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Stack
        direction={{
          xs:
            role === 'tender_client' && proposal.outter_status === 'ON_REVISION' ? 'column' : 'row',
          sm: 'row',
        }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 1, minWidth: 35, minHeight: 25 }}
        >
          <Iconify
            icon={
              currentLang.value === 'en'
                ? 'eva:arrow-ios-back-outline'
                : 'eva:arrow-ios-forward-outline'
            }
            width={25}
            height={25}
          />
        </Button>
        {role === 'tender_client' && proposal.outter_status === 'ON_REVISION' && (
          <AmandementProposalDialog />
        )}
        <ProjectStatus />
      </Stack>
      <Stack direction="column" justifyContent="space-between">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent={{ xs: 'normal', sm: 'space-between' }}
          spacing={2}
        >
          <Typography
            variant="h4"
            sx={{
              maxWidth: '700px',
            }}
          >
            {proposal.project_name}
          </Typography>
          <Button variant="contained" color="primary" size="medium" onClick={handlePreviewPrint}>
            {translate('pages.common.print_preview')}
          </Button>
        </Stack>
        <Typography sx={{ color: '#93A3B0', fontSize: '14px', mt: 2, mb: '5px' }}>
          {` ${translate('pages.project_details.created_by')} ${
            proposal.user.employee_name
          } - ${moment(proposal.created_at).locale(`${currentLang.value}`).format('L')}`}
        </Typography>
        {actionType && actionType !== 'show-project' ? <FollowUpsAction /> : null}
      </Stack>
      {!load && <ActionTap />}
      {!FEATURE_PROJECT_DETAILS ? null : <FloatinActonBar />}
    </Box>
  );
}

export default ProjectDetailsMainPage;

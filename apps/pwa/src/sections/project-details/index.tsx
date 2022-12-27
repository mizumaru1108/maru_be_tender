import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import ActionTap from './ActionTap';
import FollowUpsAction from './follow-ups/FollowUpsAction';
import React from 'react';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import ProjectStatus from './ProjectStatus';
import FloatinActonBar from './floating-action-bar/FloatinActonBar';
import { getProposal } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';

function ProjectDetailsMainPage() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { currentLang } = useLocales();

  const { proposal, isLoading, error } = useSelector((state) => state.proposal);

  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(getProposal(id as string));
  }, [dispatch, id]);

  if (isLoading) return <>... Loading</>;

  if (error) return <>{error}</>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
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
        <ProjectStatus />
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{
            maxWidth: '700px',
          }}
        >
          {proposal.project_name}
        </Typography>
        <FollowUpsAction />
      </Stack>
      <ActionTap />
      <FloatinActonBar />
    </Box>
  );
}

export default ProjectDetailsMainPage;

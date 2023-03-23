import * as React from 'react';
import { Grid, Stack, Typography, Box, Stepper, Step, Button, Divider } from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { getProposalLog, getProposalLogGrants } from 'queries/commons/getPrposalLog';
import Page500 from 'pages/Page500';
import { Link } from 'react-router-dom';
import { getProposals } from 'queries/commons/getProposal';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { Log, PropsalLog, PropsalLogGrants } from '../../../@types/proposal';
import SupervisorGrants from './role-logs/SupervisorGrants';
import SupervisorGeneral from './role-logs/SupervisorGeneral';

function ProjectPath() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepOn, setStepOn] = React.useState(1);
  const [stepUserRole, setStepUserRole] = React.useState('');
  const [stepActionType, setStepActionType] = React.useState('');
  const [stepProposal, setStepProposal] = React.useState<PropsalLog | null>(null);
  const [stepGransLog, setGransLog] = React.useState<PropsalLogGrants | null>(null);
  const [stepGeneralLog, setGeneralLog] = React.useState<Log | null>(null);

  // const [stepTrack, setStepTrack] = React.useState('');
  const { id: proposal_id } = useParams();
  const [result] = useQuery({
    query: getProposalLog,
    variables: { proposal_id },
  });
  const [logGrants] = useQuery({
    query: getProposalLogGrants,
    variables: { proposal_id },
  });

  const { data: followUps, fetching, error } = result;
  const { data: logGrantsData, fetching: fetchingGrants, error: errorGrants } = logGrants;
  const handleStep = (step: number, item: Log) => () => {
    window.scrollTo(115, 115);
    setStepOn(step);
    setActiveStep(step);
    // setStepUserRole(item.user_role);

    if (item !== undefined) {
      // setStepUserRole(item.user_role);
      // setStepActionType(item.action);
      // setStepProposal(item.proposal);
      setGeneralLog(item);
      if (item.proposal.project_track === 'CONCESSIONAL_GRANTS') {
        if (!fetchingGrants && !errorGrants) {
          setGransLog(logGrantsData);
          setGransLog({
            ...logGrantsData,
            notes: item.notes,
            updated_at: item.proposal.updated_at,
          });
        }
      }
      // setStepTrack(item.proposal.project_track);
    } else {
      setStepUserRole('');
      setStepActionType('');
    }
  };

  const lastLog = followUps?.log && followUps?.log[followUps?.log.length - 1];
  const hasNonRejectAction = lastLog?.action && lastLog?.action !== 'reject';
  const hasRejectAction = lastLog?.action && lastLog?.action === 'reject';

  React.useEffect(() => {
    if (hasNonRejectAction) {
      setActiveStep(followUps.log.length);
    } else if (hasRejectAction) {
      setActiveStep(followUps.log.length - 1);
    }
  }, [followUps, hasNonRejectAction, hasRejectAction]);

  if (fetching) return <>.. Loading</>;
  if (error) return <Page500 error={error.message} />;

  const formattedDateTime = (getDate: Date) => {
    const formattedDate = `${new Date(getDate).getDate()}.${
      new Date(getDate).getMonth() + 1
    }.${new Date(getDate).getFullYear()} ${translate(
      'project_management_headercell.at'
    )} ${new Date(getDate).getHours()}:${new Date(getDate).getMinutes()}`;

    return formattedDate;
  };
  // if (!fetching) {
  //   console.log({ followUps });
  // }
  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={8} sx={{ backgroundColor: 'transparent', px: 6 }}>
        <Stack direction="column" gap={2} justifyContent="start">
          <Typography variant="h6">{translate(`review.order_status`)}</Typography>
          {followUps.log.length !== activeStep ? (
            followUps.log.map((item: Log, index: number) => (
              <React.Fragment key={index}>
                {index === activeStep && (
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {item.action ? translate(`review.action.${item.action}`) : '-'}
                    </Typography>
                  </Stack>
                )}
              </React.Fragment>
            ))
          ) : (
            <Typography>{translate('review.waiting')}</Typography>
          )}
          {stepGeneralLog?.user_role !== 'PROJECT_SUPERVISOR' && (
            <React.Fragment>
              <Typography variant="h6">{translate(`review.notes`)}</Typography>
              {followUps.log.length !== activeStep ? (
                followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.notes ?? '-'}</Typography>
                      </Stack>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Typography>{translate('review.waiting')}</Typography>
              )}
            </React.Fragment>
          )}
          {stepGeneralLog?.user_role === 'PROJECT_SUPERVISOR' &&
            stepGeneralLog.action === ('step_back' || 'send_back_for_revision') && (
              <React.Fragment>
                <Typography variant="h6">{translate(`review.notes`)}</Typography>
                {followUps.log.length !== activeStep &&
                  followUps.log.map((item: Log, index: number) => (
                    <React.Fragment key={index}>
                      {index === activeStep && (
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>{item.notes ?? '-'}</Typography>
                        </Stack>
                      )}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            )}
          <Divider />
          {stepGeneralLog &&
          stepGeneralLog?.user_role === 'PROJECT_SUPERVISOR' &&
          stepGeneralLog.proposal.project_track !== 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action !== 'sending_closing_report' ? (
            <SupervisorGeneral stepGeneralLog={stepGeneralLog} />
          ) : null}
          {stepGransLog &&
          stepGransLog.proposal &&
          stepGeneralLog?.user_role === 'PROJECT_SUPERVISOR' &&
          stepGeneralLog.proposal.project_track === 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action !== 'sending_closing_report' ? (
            <SupervisorGrants stepGransLog={stepGransLog} />
          ) : null}
        </Stack>
      </Grid>
      <Grid item md={4} xs={4} sx={{ backgroundColor: '#fff' }}>
        <Stack direction="column" gap={2} justifyContent="start" sx={{ paddingBottom: '10px' }}>
          <Typography variant="h6">مسار المشروع</Typography>
          <Box sx={{ width: '100%', padding: '10px', maxHeight: '450px', overflowY: 'scroll' }}>
            <Stepper activeStep={followUps.log.length} orientation="vertical">
              {followUps.log.map((item: Log, index: number) => (
                <Step key={index}>
                  <Stack sx={{ direction: 'column', alignSelf: 'start' }}>
                    <Button
                      sx={{
                        padding: '0px',
                        justifyContent: 'start',
                        ':hover': { backgroundColor: '#fff' },
                      }}
                      onClick={handleStep(index, item)}
                    >
                      <Stack direction="row" gap={2}>
                        <PanoramaFishEyeIcon sx={{ color: '#000', alignSelf: 'center' }} />
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: index === activeStep ? '17px' : '12px',
                              fontWeight: index === activeStep ? 800 : 400,
                              color: '#000',
                              alignSelf: 'start',
                            }}
                          >
                            {translate(`permissions.${item.user_role}`)}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#000', alignSelf: 'start' }}>
                            {formattedDateTime(item.created_at)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Button>
                  </Stack>
                </Step>
              ))}
              {(activeRole! === 'tender_moderator' || hasNonRejectAction) && (
                <>
                  {followUps.log.length ? (
                    <Step>
                      <Stack sx={{ direction: 'column', alignSelf: 'start' }}>
                        <Button
                          sx={{
                            padding: '0px',
                            justifyContent: 'start',
                            ':hover': { backgroundColor: '#fff' },
                          }}
                          onClick={handleStep(
                            followUps.log.length,
                            followUps.log[followUps.log.length]
                          )}
                        >
                          {followUps.log[followUps.log.length - 1].proposal && (
                            <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                              <CircleIcon sx={{ color: '#0E8478', alignSelf: 'center' }} />
                              <Typography
                                sx={{
                                  fontSize: followUps.log.length === activeStep ? '17px' : '12px',
                                  fontWeight: followUps.log.length === activeStep ? 800 : 400,
                                  color: '#000',
                                  alignSelf: 'center',
                                }}
                              >
                                {translate(
                                  `permissions.${
                                    followUps.log[followUps.log.length - 1].proposal.state
                                  }`
                                )}
                              </Typography>
                            </Stack>
                          )}
                        </Button>
                      </Stack>
                    </Step>
                  ) : (
                    // <Step>
                    <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                      <CircleIcon sx={{ color: '#0E8478', alignSelf: 'center' }} />
                      <Stack sx={{ direction: 'column', alignSelf: 'start' }}>
                        <Button
                          sx={{
                            padding: '0px',
                            justifyContent: 'start',
                            ':hover': { backgroundColor: '#fff' },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '17px',
                              fontWeight: 800,
                              color: '#000',
                              alignSelf: 'center',
                            }}
                          >
                            {translate(`permissions.MODERATOR`)}
                          </Typography>
                        </Button>
                      </Stack>
                    </Stack>
                    // </Step>
                  )}
                </>
              )}
            </Stepper>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default ProjectPath;

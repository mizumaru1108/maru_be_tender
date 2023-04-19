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
import PanoramaFishEyeTwoToneIcon from '@mui/icons-material/PanoramaFishEyeTwoTone';
import { dispatch, useSelector } from '../../../redux/store';
import { getProposal } from '../../../redux/slices/proposal';
import ProjectManager from './role-logs/ProjectManager';
import FinancePaymentLog from './role-logs/FinancePaymentLog';
import CashierPaymentLog from './role-logs/CashierPaymentLog';
import ClientClosingReport from './role-logs/ClientClosingReport';

function ProjectPath() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const { proposal } = useSelector((state) => state.proposal);

  const [activeStep, setActiveStep] = React.useState(-1);
  const [stepOn, setStepOn] = React.useState(1);
  const [stepUserRole, setStepUserRole] = React.useState('');
  const [stepActionType, setStepActionType] = React.useState('');
  const [stepProposal, setStepProposal] = React.useState<PropsalLog | null>(null);
  const [stepGransLog, setGransLog] = React.useState<PropsalLogGrants | null>(null);
  const [stepGeneralLog, setGeneralLog] = React.useState<Log | null>(null);
  const [isPayments, setIsPayments] = React.useState(false);

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
            action: item.action,
            message: item.message,
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
  const isCompleted = lastLog?.action && lastLog?.action === 'project_completed';

  // console.log({ hasNonRejectAction, hasRejectAction, isCompleted, activeStep });

  // React.useEffect(() => {
  //   if (hasNonRejectAction) {
  //     setActiveStep(followUps.log.length);
  //   } else if (hasRejectAction) {
  //     setActiveStep(followUps.log.length - 1);
  //   }
  // }, [followUps, hasNonRejectAction, hasRejectAction]);
  React.useEffect(() => {
    const chceckCeoAcc = followUps?.log
      .filter((item: Log) => item.user_role === 'CEO' && item.action === 'accept')
      .map((item: Log) => item);
    if (chceckCeoAcc && chceckCeoAcc.length > 0) {
      setActiveStep(0);
      setIsPayments(true);
    }
  }, [followUps]);
  console.log({ activeStep });

  React.useEffect(() => {
    dispatch(getProposal(proposal_id as string, activeRole! as string));
  }, [proposal_id, activeRole]);

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
  if (fetching) return <>Loading...</>;

  // console.log({ followUps });
  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={8} sx={{ backgroundColor: 'transparent', px: 6 }}>
        <Stack direction="column" gap={2} justifyContent="start">
          {/* <Typography variant="h6">
            {!isCompleted ? translate(`review.order_status`) : ''}
          </Typography> */}
          {isCompleted && activeStep === -1 ? (
            <Typography variant="h6">{translate(`review.complete`)}</Typography>
          ) : (
            <Typography variant="h6">{translate(`review.order_status`)}</Typography>
          )}
          {activeStep !== -1 && followUps.log.length !== activeStep ? (
            followUps.log.map((item: Log, index: number) => (
              <React.Fragment key={index}>
                {index === activeStep && (
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.user_role === 'PROJECT_MANAGER' &&
                      item.action === 'set_by_supervisor'
                        ? translate(`review.action.payment_rejected_by_pm`)
                        : item.action
                        ? translate(`review.action.${item.action}`)
                        : '-'}
                    </Typography>
                  </Stack>
                )}
              </React.Fragment>
            ))
          ) : (
            <Typography>
              {isCompleted && activeStep === -1 ? null : translate('review.waiting')}
            </Typography>
          )}
          {stepGeneralLog?.user_role !== 'PROJECT_SUPERVISOR' && (
            <React.Fragment>
              {/* <Typography variant="h6">{!isCompleted ? translate(`review.notes`) : ''}</Typography> */}
              {isCompleted && activeStep === -1 ? null : (
                <Typography variant="h6">{translate(`review.notes`)}</Typography>
              )}
              {activeStep !== -1 && followUps.log.length !== activeStep ? (
                followUps.log
                  .filter(
                    (item: Log) =>
                      item.action !== 'set_by_supervisor' &&
                      item.action !== 'accepted_by_project_manager' &&
                      item.action !== 'done'
                  )
                  .map((item: Log, index: number) => (
                    <React.Fragment key={index}>
                      {followUps.log[index].action !== 'set_by_supervisor' &&
                      index === activeStep ? (
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>{item.notes ?? '-'}</Typography>
                        </Stack>
                      ) : null}
                    </React.Fragment>
                  ))
              ) : (
                <Typography>
                  {isCompleted && activeStep === -1 ? null : translate('review.waiting')}
                </Typography>
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
          {/* CashierPaymentLog */}
          {isCompleted && activeStep === -1 ? null : <Divider />}
          {activeStep !== followUps.log.length &&
          stepGeneralLog &&
          stepGeneralLog?.user_role === 'FINANCE' &&
          // stepGeneralLog.proposal.project_track !== 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action !== 'sending_closing_report' &&
          stepGeneralLog.action === 'accepted_by_finance' ? (
            <FinancePaymentLog stepGeneralLog={stepGeneralLog} />
          ) : null}
          {activeStep !== followUps.log.length &&
          stepGeneralLog &&
          stepGeneralLog?.user_role === 'CASHIER' &&
          // stepGeneralLog.proposal.project_track !== 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action !== 'sending_closing_report' &&
          stepGeneralLog.action === 'done' ? (
            <CashierPaymentLog stepGeneralLog={stepGeneralLog} />
          ) : null}
          {(activeStep !== followUps.log.length &&
            stepGeneralLog &&
            stepGeneralLog?.user_role === 'PROJECT_MANAGER' &&
            // stepGeneralLog.proposal.project_track !== 'CONCESSIONAL_GRANTS' &&
            stepGeneralLog.action !== 'send_back_for_revision' &&
            stepGeneralLog.action !== 'step_back' &&
            stepGeneralLog.action !== 'sending_closing_report' &&
            stepGeneralLog.action === 'set_by_supervisor') ||
          (stepGeneralLog && stepGeneralLog.action === 'accepted_by_project_manager') ? (
            <ProjectManager stepGeneralLog={stepGeneralLog} />
          ) : null}
          {activeStep !== followUps.log.length &&
          stepGeneralLog &&
          stepGeneralLog?.user_role === 'PROJECT_SUPERVISOR' &&
          stepGeneralLog.proposal.project_track !== 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action !== 'sending_closing_report' ? (
            <SupervisorGeneral stepGeneralLog={stepGeneralLog} />
          ) : null}
          {activeStep !== followUps.log.length &&
          stepGransLog &&
          stepGransLog.proposal &&
          stepGeneralLog?.user_role === 'PROJECT_SUPERVISOR' &&
          stepGeneralLog.proposal.project_track === 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action !== 'sending_closing_report' ? (
            <SupervisorGrants stepGransLog={stepGransLog} />
          ) : null}
          {activeStep !== followUps.log.length &&
          stepGransLog &&
          stepGransLog.proposal &&
          stepGeneralLog?.user_role === 'CLIENT' &&
          // stepGeneralLog.proposal.project_track === 'CONCESSIONAL_GRANTS' &&
          stepGeneralLog.action !== 'send_back_for_revision' &&
          stepGeneralLog.action !== 'step_back' &&
          stepGeneralLog.action === 'project_completed' ? (
            <ClientClosingReport stepGransLog={stepGransLog} />
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
                        <PanoramaFishEyeTwoToneIcon
                          color={activeStep === index ? 'primary' : 'disabled'}
                          sx={{
                            // color: activeStep === index ? '#0E8478' : '#000',
                            alignSelf: 'center',
                          }}
                        />
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: index === activeStep ? '17px' : '12px',
                              fontWeight: index === activeStep ? 800 : 600,
                              color: '#000',
                              alignSelf: 'start',
                            }}
                          >
                            {translate(`permissions.${item.user_role}`)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: index === activeStep ? '17px' : '12px',
                              fontWeight: index === activeStep ? 800 : 600,
                              color: '#000',
                              alignSelf: 'start',
                            }}
                          >
                            {(item && item.reviewer && item.reviewer.employee_name) ?? 'CLIENT'}
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
              {(activeRole! === 'tender_moderator' || hasNonRejectAction) && !isCompleted && (
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
                          {followUps.log[followUps.log.length - 1].proposal && !isPayments && (
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
                                {proposal.outter_status !== 'ASKED_FOR_AMANDEMENT'
                                  ? translate(`permissions.${proposal.state}`)
                                  : translate(`permissions.PROJECT_SUPERVISOR`)}
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

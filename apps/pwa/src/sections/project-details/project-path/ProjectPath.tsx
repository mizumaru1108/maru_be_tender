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
// import { getProposal, getTrackBudget } from '../../../redux/slices/proposal';
import FinancePaymentLog from './role-logs/FinancePaymentLog';
import CashierPaymentLog from './role-logs/CashierPaymentLog';
import ClientClosingReport from './role-logs/ClientClosingReport';
import { getTracks } from 'queries/commons/getTracks';
import ProjectManagerGeneral from './role-logs/ProjectManager';
import ClientProposalLog from './role-logs/ClientProposalLog';

function ProjectPath() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const [logs, setLogs] = React.useState<Log[]>();
  // console.log({ proposal });
  // console.log('proposal.log', proposal.proposal_logs);
  // console.log('proposal.log', proposal.track.with_consultation);

  const [activeStep, setActiveStep] = React.useState(0);
  // console.log({ activeStep });
  const [stepOn, setStepOn] = React.useState(1);
  const [stepUserRole, setStepUserRole] = React.useState('');
  const [stepActionType, setStepActionType] = React.useState('');
  const [stepProposal, setStepProposal] = React.useState<PropsalLog | null>(null);
  const [stepGransLog, setGransLog] = React.useState<PropsalLogGrants | null>();
  const [stepGeneralLog, setGeneralLog] = React.useState<Log | null>(null);
  const [isPayments, setIsPayments] = React.useState(false);

  const isConsultation = (proposal && proposal.track && proposal.track.with_consultation) ?? false;

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
  const [tracks] = useQuery({
    query: getTracks,
    variables: {},
  });

  const { data: followUps, fetching, error } = result;
  const { data: logGrantsData, fetching: fetchingGrants, error: errorGrants } = logGrants;
  const { data: listTracks, fetching: fetchingTracks, error: errorTracks } = tracks;
  const handleStep = (step: number, item: Log) => () => {
    window.scrollTo(115, 115);
    setStepOn(step);
    setActiveStep(step);
    if (item !== undefined) {
      setGeneralLog(item);
      if (item && isConsultation) {
        if (!fetchingGrants && !errorGrants) {
          setGransLog(logGrantsData);
          setGransLog({
            ...logGrantsData,
            notes: item?.notes || '',
            updated_at: item?.updated_at || '',
            action: item?.action || '',
            message: item?.message || '',
            user_role: item?.user_role || '',
          });
        }
      }
    } else {
      setStepUserRole('');
      setStepActionType('');
    }
  };

  const lastLog =
    proposal.proposal_logs && proposal.proposal_logs[proposal.proposal_logs.length - 1];
  const hasNonRejectAction =
    lastLog?.action && lastLog?.action !== 'reject'
      ? true
      : lastLog?.action === null
      ? true
      : false;
  const hasRejectAction = lastLog?.action && lastLog?.action === 'reject';
  const isCompleted = lastLog?.action && lastLog?.action === 'project_completed' ? true : false;
  React.useEffect(() => {
    const insertPayment = proposal.proposal_logs
      .filter((item: Log) => item.action === 'insert_payment')
      .map((item: Log) => item);
    if (insertPayment && insertPayment.length > 0) {
      setIsPayments(true);
    }
    const tmpLogs = [...proposal.proposal_logs]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .filter((item: Log) => item.action || (item.action === null && item.state === 'CLIENT'));
    if (tmpLogs.length > 0) {
      setLogs(tmpLogs);
      setActiveStep(tmpLogs.length - 1);
    }
    setGransLog((current) => {
      const tmpData = { ...current };
      return {
        ...current,
        action: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.action || '',
        message: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.message || '',
        notes: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.notes || '',
        updated_at: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.updated_at || '',
        user_role: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.user_role || '',
      };
    });
    setGeneralLog((current: any) => {
      const tmpData = { ...current };
      return {
        ...current,
        action: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.action || '',
        message: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.message || '',
        notes: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.notes || '',
        updated_at: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.updated_at || '',
        created_at: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.created_at || '',
        state: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.state || '',
        user_role: proposal.proposal_logs[proposal.proposal_logs.length - 1]?.user_role || '',
        reviewer: {
          employee_name:
            proposal.proposal_logs[proposal.proposal_logs.length - 1]?.reviewer?.employee_name ||
            '',
        },
        employee_name:
          proposal.proposal_logs[proposal.proposal_logs.length - 1]?.employee_name || '',
      };
    });
  }, [followUps, proposal]);

  // React.useEffect(() => {
  //   // dispatch(getProposal(proposal_id as string, activeRole! as string));
  //   dispatch(getTrackBudget(proposal.track_id as string, activeRole! as string));
  //   // if (!isLoading) {
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeRole, isLoading]);

  const formattedDateTime = (getDate: Date) => {
    const formattedDate = `${new Date(getDate).getDate()}.${
      new Date(getDate).getMonth() + 1
    }.${new Date(getDate).getFullYear()} ${translate(
      'project_management_headercell.at'
    )} ${new Date(getDate).getHours()}:${new Date(getDate).getMinutes()}`;

    return formattedDate;
  };
  if (fetching || fetchingTracks || fetchingGrants || isLoading) return <>Loading...</>;
  if (error || errorTracks || errorGrants || (logs && logs.length === 0 && !fetching)) {
    // return (
    //   <Page500
    //     error={
    //       error.message
    //         ? error.message
    //         : errorGrants.message
    //         ? errorGrants.message
    //         : errorTracks.message
    //     }
    //   />
    // );
    if (error && error.message) {
      return <Page500 error={error.message} />;
    }
    if (errorGrants && errorGrants.message) {
      return <Page500 error={errorGrants.message} />;
    }
    if (errorTracks && errorTracks.message) {
      return <Page500 error={errorTracks.message} />;
    }
  }
  // console.log({ logs, proposal });
  return (
    <Grid container>
      <Grid item md={4} xs={4} sx={{ backgroundColor: '#fff' }}>
        <Stack direction="column" gap={2} justifyContent="start" sx={{ paddingBottom: '10px' }}>
          <Typography variant="h6">مسار المشروع</Typography>
          <Box sx={{ width: '100%', padding: '10px', maxHeight: '100vh', overflowY: 'scroll' }}>
            <Stepper activeStep={logs && logs.length} orientation="vertical">
              {logs &&
                logs.length > 0 &&
                logs.map((item: Log, index: number) => (
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
                              {translate(`permissions.${item.user_role ?? item.state}`)}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: index === activeStep ? '17px' : '12px',
                                fontWeight: index === activeStep ? 800 : 600,
                                color: '#000',
                                alignSelf: 'start',
                              }}
                            >
                              {(item && item.reviewer && item.reviewer.employee_name) ??
                                proposal?.user?.employee_name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: '12px', color: '#000', alignSelf: 'start' }}
                            >
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
                  {logs && logs.length > 0 ? (
                    <Step>
                      <Stack sx={{ direction: 'column', alignSelf: 'start' }}>
                        <Button
                          sx={{
                            padding: '0px',
                            justifyContent: 'start',
                            ':hover': { backgroundColor: '#fff' },
                          }}
                          onClick={handleStep(logs!.length, logs![logs!.length])}
                        >
                          {proposal && !isPayments && (
                            <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                              <CircleIcon sx={{ color: '#0E8478', alignSelf: 'center' }} />
                              <Typography
                                sx={{
                                  fontSize: logs && logs.length === activeStep ? '17px' : '12px',
                                  fontWeight: logs && logs.length === activeStep ? 800 : 400,
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
                    <Step>
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
                    </Step>
                  )}
                </>
              )}
            </Stepper>
          </Box>
        </Stack>
      </Grid>
      {logs && logs.length > 0 && (
        <Grid item md={8} xs={8} sx={{ backgroundColor: 'transparent', px: 6 }}>
          <Stack direction="column" gap={2} justifyContent="start">
            {/*  */}
            {/* Order Status or Complete */}
            {isCompleted && activeStep === -1 ? (
              <Typography variant="h6">{translate(`review.complete`)}</Typography>
            ) : (
              <Typography variant="h6">{translate(`review.order_status`)}</Typography>
            )}
            {/*  */}

            {/*  */}
            {/* ACCEPT, REJECT, and so on */}
            {activeStep !== -1 && logs.length !== activeStep ? (
              logs
                .filter((item: Log, index: number) => index === activeStep && item)
                .map((item: Log, index: number) => (
                  <Stack key={index} direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {item?.user_role === 'PROJECT_MANAGER' && item?.action === 'set_by_supervisor'
                        ? translate(`review.action.payment_rejected_by_pm`)
                        : item.action
                        ? translate(`review.action.${item.action}`)
                        : item?.user_role === 'CLIENT'
                        ? translate(`review.action.proposal_created`)
                        : '-'}
                    </Typography>
                  </Stack>
                ))
            ) : (
              <Typography>
                {isCompleted && activeStep === logs.length ? null : translate('review.waiting')}
              </Typography>
            )}
            {/*  */}

            {/*  */}
            {logs.find((item: Log, index: number) => index === activeStep && item)?.user_role !==
              'PROJECT_SUPERVISOR' && (
              <React.Fragment>
                {(isCompleted && activeStep === -1) ||
                (activeStep + 1 === logs.length && stepGeneralLog?.state === 'CLIENT') ? null : (
                  <Typography variant="h6">{translate(`review.notes`)}</Typography>
                )}
                {activeStep !== -1 && logs.length !== activeStep ? (
                  logs
                    .filter(
                      (item: Log, index: number) =>
                        item.action !== 'set_by_supervisor' &&
                        // item.action !== 'accepted_by_project_manager' &&
                        index === activeStep
                    )
                    .map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>
                            {item.notes === 'Proposal has been revised'
                              ? translate('proposal_has_been_revised')
                              : item.notes ?? '-'}
                          </Typography>
                        </Stack>
                      </React.Fragment>
                    ))
                ) : (
                  <Typography>
                    {(isCompleted && activeStep === -1) ||
                    (activeStep + 1 === logs.length && stepGeneralLog?.state === 'CLIENT')
                      ? null
                      : translate('review.waiting')}
                  </Typography>
                )}
              </React.Fragment>
            )}
            {/*  */}
            {/* CashierPaymentLog */}
            {isCompleted && activeStep === -1 ? null : <Divider />}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'CLIENT' || item.state === 'FINANCE') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                (item.action === null || item.action === undefined)
            ).length > 0 ? (
              <ClientProposalLog />
            ) : null}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'FINANCE' || item.state === 'FINANCE') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                item.action === 'accepted_by_finance'
            ).length > 0 && stepGeneralLog ? (
              <FinancePaymentLog stepGeneralLog={stepGeneralLog} />
            ) : null}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'CASHIER' || item.state === 'CASHIER') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                item.action === 'done'
            ).length > 0 && stepGeneralLog ? (
              <CashierPaymentLog stepGeneralLog={stepGeneralLog} />
            ) : null}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'PROJECT_MANAGER' ||
                  item.user_role === 'CEO' ||
                  item.state === 'PROJECT_MANAGER' ||
                  item.state === 'CEO') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                (item.action === 'accepted_by_project_manager' || item.action === 'accept')
            ).length > 0 &&
            (stepGeneralLog || stepGransLog) ? (
              <ProjectManagerGeneral
                isConsultation={isConsultation}
                stepGeneralLog={stepGeneralLog ?? stepGransLog}
              />
            ) : null}
            {/*  */}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'PROJECT_SUPERVISOR' || item.state === 'PROJECT_SUPERVISOR') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'project_completed' &&
                item.action !== 'sending_closing_report' &&
                item.action !== 'send_revised_version' &&
                item.action !== 'complete_payment'
            ).length > 0 &&
            isConsultation === false &&
            stepGeneralLog ? (
              <SupervisorGeneral stepGeneralLog={stepGeneralLog} />
            ) : null}
            {/*  */}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'PROJECT_SUPERVISOR' || item.state === 'PROJECT_SUPERVISOR') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'project_completed' &&
                item.action !== 'sending_closing_report' &&
                item.action !== 'complete_payment' &&
                item.action !== 'send_revised_version'
            ).length > 0 &&
            isConsultation &&
            stepGransLog ? (
              <SupervisorGrants stepGransLog={stepGransLog} />
            ) : null}
            {/*  */}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                index === activeStep &&
                (item.user_role === 'CLIENT' || item.state === 'CLIENT') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                item.action === 'project_completed'
            ).length > 0 &&
            (stepGeneralLog || stepGransLog) ? (
              <ClientClosingReport stepGransLog={stepGransLog ?? stepGeneralLog} />
            ) : null}
            {/*  */}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectPath;

import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeTwoToneIcon from '@mui/icons-material/PanoramaFishEyeTwoTone';
import { Box, Button, Divider, Grid, Stack, Step, Stepper, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import Page500 from 'pages/Page500';
import { getProposalLog } from 'queries/commons/getPrposalLog';
import * as React from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import { Log, PropsalLog, PropsalLogGrants } from '../../../@types/proposal';
import { useSelector } from '../../../redux/store';
import SupervisorGeneral from './role-logs/SupervisorGeneral';
import SupervisorGrants from './role-logs/SupervisorGrants';
// import { getProposal, getTrackBudget } from '../../../redux/slices/proposal';
import { getTracks } from 'queries/commons/getTracks';
import {
  FEATURE_PROJECT_PATH_NEW,
  REOPEN_TMRA_f92ada8c1019457c874d79fc6d592d2c,
} from '../../../config';
import CashierPaymentLog from './role-logs/CashierPaymentLog';
import ClientClosingReport from './role-logs/ClientClosingReport';
import ClientProposalLog from './role-logs/ClientProposalLog';
import FinancePaymentLog from './role-logs/FinancePaymentLog';
import ProjectManager from './role-logs/ProjectManager';
import ProjectManagerRev from './role-logs/ProjectManagerRev';
import SupervisorGeneralRev from './role-logs/SupervisorGeneralRev';
import SupervisorGrantsRev from './role-logs/SupervisorGrantsRev';
import { IsPaymentAction } from 'utils/checkIsPaymentAction';
import { CheckType, LogAction, LogActionCheck } from 'utils/logActionCheck';
import Space from '../../../components/space/space';

function ProjectPath() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const [logs, setLogs] = React.useState<Log[]>();
  // console.log({ proposal });
  // console.log('proposal.log', proposal.proposal_logs);
  // console.log('proposal.log', proposal.track.with_consultation);

  const [activeStep, setActiveStep] = React.useState<string>('-1');
  // console.log({ activeStep });
  // const [stepOn, setStepOn] = React.useState(1);
  // const [stepUserRole, setStepUserRole] = React.useState('');
  // const [stepActionType, setStepActionType] = React.useState('');
  // const [stepProposal, setStepProposal] = React.useState<PropsalLog | null>(null);
  const [stepGransLog, setGransLog] = React.useState<PropsalLogGrants | null>(null);
  const [stepGeneralLog, setGeneralLog] = React.useState<PropsalLog | null>(null);
  const [isPayments, setIsPayments] = React.useState(false);

  const isConsultation = (proposal && proposal.track && proposal.track.with_consultation) ?? false;

  // const [stepTrack, setStepTrack] = React.useState('');
  const { id: proposal_id } = useParams();
  const [result] = useQuery({
    query: getProposalLog,
    variables: { proposal_id },
  });
  // const [logGrants] = useQuery({
  //   query: getProposalLogGrants,
  //   variables: { proposal_id },
  // });
  const [tracks] = useQuery({
    query: getTracks,
    variables: {},
  });

  const { data: followUps, fetching, error } = result;
  // const { data: logGrantsData, fetching: fetchingGrants, error: errorGrants } = logGrants;
  const { data: listTracks, fetching: fetchingTracks, error: errorTracks } = tracks;
  const handleStep = (step: string, item: Log | undefined) => () => {
    // console.log({ item, step });
    window.scrollTo(115, 115);
    // setStepOn(step);
    setActiveStep(step || '-1');
    if (item !== undefined) {
      setGeneralLog(item);
      if (item && isConsultation) {
        setGransLog(item);
      }
    } else {
      setGransLog(null);
      setGeneralLog(null);
    }
    // else {
    //   setStepUserRole('');
    //   setStepActionType('');
    // }
  };
  // console.log({ activeStep, stepGransLog, stepGeneralLog });
  const lastLog =
    proposal.proposal_logs && proposal.proposal_logs[proposal.proposal_logs.length - 1];
  const hasNonRejectAction =
    lastLog?.action && lastLog?.action !== 'reject'
      ? true
      : lastLog?.action === null
      ? true
      : false;
  // const hasRejectAction = lastLog?.action && lastLog?.action === 'reject';
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
      .filter(
        (item: Log) =>
          (item.action && item.action !== 'update') ||
          (item.action && item.action === 'update' && proposal.track.with_consultation) ||
          (item.action === null && item.state === 'CLIENT')
      );
    if (tmpLogs.length > 0) {
      setLogs(tmpLogs);
      setActiveStep(tmpLogs[tmpLogs.length - 1]?.id || '-1');
    }
    // const tmpLogProposal = [...proposal.proposal_logs].filter((item: Log) => item.action);

    setGransLog((current) => {
      const tmpData = { ...current };
      return {
        ...current,
        new_values: tmpLogs[tmpLogs.length - 1]?.new_values || null,
        created_at: tmpLogs[tmpLogs.length - 1]?.created_at || '',
        state: tmpLogs[tmpLogs.length - 1]?.state || '',
        reviewer: tmpLogs[tmpLogs.length - 1]?.reviewer || '',
        employee_name: tmpLogs[tmpLogs.length - 1]?.employee_name || '',
        user_role_id: tmpLogs[tmpLogs.length - 1]?.user_role_id || '',
        action: tmpLogs[tmpLogs.length - 1]?.action || '',
        message: tmpLogs[tmpLogs.length - 1]?.message || '',
        notes: tmpLogs[tmpLogs.length - 1]?.notes || '',
        updated_at: tmpLogs[tmpLogs.length - 1]?.updated_at || '',
        user_role: tmpLogs[tmpLogs.length - 1]?.user_role || '',
      };
    });
    setGeneralLog((current: any) => {
      const tmpData = { ...current };
      return {
        ...current,
        new_values: tmpLogs[tmpLogs.length - 1]?.new_values || null,
        // proposal_log: tmpLogs[tmpLogs.length - 1]?.new_values || null,
        action: tmpLogs[tmpLogs.length - 1]?.action || '',
        message: tmpLogs[tmpLogs.length - 1]?.message || '',
        notes: tmpLogs[tmpLogs.length - 1]?.notes || '',
        updated_at: tmpLogs[tmpLogs.length - 1]?.updated_at || '',
        created_at: tmpLogs[tmpLogs.length - 1]?.created_at || '',
        state: tmpLogs[tmpLogs.length - 1]?.state || '',
        user_role: tmpLogs[tmpLogs.length - 1]?.user_role || '',
        reviewer: {
          employee_name: tmpLogs[tmpLogs.length - 1]?.reviewer?.employee_name || '',
        },
        employee_name: tmpLogs[tmpLogs.length - 1]?.employee_name || '',
      };
    });
  }, [followUps, proposal]);

  const formattedDateTime = (getDate: Date) => {
    const formattedDate = `${new Date(getDate).getDate()}.${
      new Date(getDate).getMonth() + 1
    }.${new Date(getDate).getFullYear()} ${translate(
      'project_management_headercell.at'
    )} ${new Date(getDate).getHours()}:${new Date(getDate).getMinutes()}`;

    return formattedDate;
  };
  if (fetching || fetchingTracks || isLoading) return <>Loading...</>;
  if (error || errorTracks || (logs && logs.length === 0 && !fetching)) {
    if (error && error.message) {
      return <Page500 error={error.message} />;
    }
    if (errorTracks && errorTracks.message) {
      return <Page500 error={errorTracks.message} />;
    }
  }
  // console.log({ activeStep });
  return (
    <Grid container>
      <Grid item md={4} xs={4} sx={{ backgroundColor: '#fff' }}>
        <Stack direction="column" gap={2} justifyContent="start" sx={{ paddingBottom: '10px' }}>
          <Typography variant="h6">مسار المشروع</Typography>
          <Box sx={{ width: '100%', padding: '10px', maxHeight: '180vh', overflowY: 'scroll' }}>
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
                        onClick={handleStep(item?.id || '-1', item)}
                      >
                        <Stack direction="row" gap={2}>
                          <PanoramaFishEyeTwoToneIcon
                            color={activeStep === item.id ? 'primary' : 'disabled'}
                            sx={{
                              // color: activeStep === index ? '#0E8478' : '#000',
                              alignSelf: 'center',
                            }}
                          />
                          <Stack>
                            <Typography
                              sx={{
                                fontSize: activeStep === item.id ? '17px' : '12px',
                                fontWeight: activeStep === item.id ? 800 : 600,
                                color: '#000',
                                alignSelf: 'start',
                              }}
                            >
                              {translate(`permissions.${item.user_role ?? item.state}`)}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: activeStep === item.id ? '17px' : '12px',
                                fontWeight: activeStep === item.id ? 800 : 600,
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
              {REOPEN_TMRA_f92ada8c1019457c874d79fc6d592d2c &&
                logs &&
                logs[logs.length - 1].action !== 'reject' &&
                logs[logs.length - 1].user_role !== 'MODERATOR' &&
                (activeRole! === 'tender_moderator' || hasNonRejectAction) &&
                !isCompleted && (
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
                            onClick={handleStep('-1', undefined)}
                          >
                            {proposal && !isPayments && (
                              <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                                <CircleIcon sx={{ color: '#0E8478', alignSelf: 'center' }} />
                                <Typography
                                  sx={{
                                    fontSize: logs && activeStep === '-1' ? '17px' : '12px',
                                    fontWeight: logs && activeStep === '-1' ? 800 : 400,
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
            {isCompleted && activeStep === '-1' ? (
              <Typography variant="h6">{translate(`review.complete`)}</Typography>
            ) : (
              <Typography variant="h6">{translate(`review.order_status`)}</Typography>
            )}
            {/*  */}

            {/*  */}
            {/* ACCEPT, REJECT, and so on */}
            {activeStep !== '-1' ? (
              logs
                .filter((item: Log, index: number) => item.id === activeStep)
                .map((item: Log, index: number) => {
                  // console.log({ item });
                  const { action, user_role } = item;
                  return (
                    <Stack key={index} direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {user_role === 'PROJECT_MANAGER' && action === 'set_by_supervisor'
                          ? translate(`review.action.payment_rejected_by_pm`)
                          : action
                          ? translate(`review.action.${action}`)
                          : user_role === 'CLIENT'
                          ? translate(`review.action.proposal_created`)
                          : null}
                      </Typography>
                    </Stack>
                  );
                })
            ) : (
              <Typography>
                {isCompleted && logs[logs.length - 1].id === activeStep
                  ? null
                  : translate('review.waiting')}
              </Typography>
            )}
            {/*  */}

            {/*  */}
            <React.Fragment>
              {(isCompleted && activeStep === '-1') ||
              (logs[logs.length - 1].id === activeStep && stepGeneralLog?.state === 'CLIENT')
                ? null
                : // <Typography variant="h6">{translate(`review.notes`)}</Typography>
                  logs
                    .filter((item: Log, index: number) => activeStep === item.id)
                    .map((item: Log, index: number) => (
                      <Stack key={index} direction="column" gap={2}>
                        {/* <Typography>
                        {item?.user_role === 'PROJECT_MANAGER' && item?.action === 'set_by_supervisor'
                          ? translate(`review.action.payment_rejected_by_pm`)
                          : item.action
                          ? translate(`review.action.${item.action}`)
                          : item?.user_role === 'CLIENT'
                          ? translate(`review.action.proposal_created`)
                          : null}
                      </Typography> */}
                        <Typography variant="h6">
                          {item.notes &&
                          (item.action === 'reject' ||
                            item.action === 'send_back_for_revision' ||
                            item.action === 'send_revised_version' ||
                            item.action === 'step_back' ||
                            item.action === 'one_step_back' ||
                            item.action === 'rejected_by_project_manager' ||
                            (item.action === 'accept' && item.user_role === 'MODERATOR'))
                            ? translate(`review.notes`)
                            : null}
                        </Typography>
                      </Stack>
                    ))}
              {logs
                .filter((item: Log, index: number) => activeStep === item.id)
                .map((item: Log, index: number) => (
                  <Stack key={index} direction="column" gap={2}>
                    {item.reject_reason && item.action === 'reject' ? (
                      <>
                        <Typography variant="h6">{translate(`review.reject_reason`)}</Typography>
                        <Space size='small' direction='vertical'/>
                        <Typography variant="h6">{item.reject_reason || '-'}</Typography>
                      </>
                    ) : null}
                  </Stack>
                ))}
              {activeStep === '-1' && !stepGeneralLog && !stepGransLog && (
                <Typography variant="h6">{translate(`review.notes`)}</Typography>
              )}
              {activeStep !== '-1' ? (
                logs
                  .filter(
                    (item: Log, index: number) =>
                      // item.action !== 'set_by_supervisor' &&
                      // item.action !== 'accepted_by_project_manager' &&
                      activeStep === item.id
                  )
                  .map((item: Log, index: number) => (
                    <React.Fragment key={index}>
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>
                          {item.notes === 'Proposal has been revised'
                            ? translate('proposal_has_been_revised')
                            : (item.action === 'accept' || item.action === 'update') &&
                              (item.user_role === 'PROJECT_MANAGER' ||
                                item.user_role === 'CEO' ||
                                item.user_role === 'PROJECT_SUPERVISOR')
                            ? null
                            : item.notes ?? null}
                        </Typography>
                      </Stack>
                    </React.Fragment>
                  ))
              ) : (
                <Typography>
                  {/* {(isCompleted && activeStep === '-1') ||
                  (logs[logs.length - 1].id === activeStep && stepGeneralLog?.state === 'CLIENT')
                    ? null
                    : !IsPaymentAction(logs[logs.length - 1].action) &&
                      LogActionCheck({
                        action: logs[logs.length - 1].action as LogAction,
                        type: CheckType.notIn,
                        logAction: [
                          LogAction.Update,
                          LogAction.Reject,
                          LogAction.Accept,
                          LogAction.RejectedByProjectManager,
                        ],
                      })
                    ? translate('review.waiting')
                    : null} */}
                  {activeStep === '-1' && <>{translate('review.waiting')}</>}
                  {logs[logs.length - 1].id === activeStep && stepGeneralLog?.state === 'CLIENT'
                    ? null
                    : !IsPaymentAction(logs[logs.length - 1].action) &&
                      LogActionCheck({
                        action: logs[logs.length - 1].action as LogAction,
                        type: CheckType.notIn,
                        logAction: [
                          LogAction.Update,
                          LogAction.Reject,
                          LogAction.Accept,
                          LogAction.RejectedByProjectManager,
                        ],
                      })
                    ? translate('review.waiting')
                    : null}
                </Typography>
              )}
            </React.Fragment>
            {/*  */}
            {/* CashierPaymentLog */}
            {isCompleted && activeStep === '-1' ? null : <Divider />}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
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
                activeStep === item.id &&
                (item.user_role === 'FINANCE' || item.state === 'FINANCE') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                (item.action === 'accepted_by_finance' ||
                  item.action === 'reject_cheque' ||
                  item.action === 'done')
            ).length > 0 && stepGeneralLog ? (
              <FinancePaymentLog stepGeneralLog={stepGeneralLog} />
            ) : null}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
                (item.user_role === 'CASHIER' || item.state === 'CASHIER') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                (item.action === 'done' || item.action === 'uploaded_by_cashier')
            ).length > 0 && stepGeneralLog ? (
              <CashierPaymentLog stepGeneralLog={stepGeneralLog} />
            ) : null}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
                (item.user_role === 'PROJECT_MANAGER' ||
                  item.user_role === 'CEO' ||
                  item.state === 'PROJECT_MANAGER' ||
                  item.state === 'CEO') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'sending_closing_report' &&
                item.action !== 'reject' &&
                (item.action === 'accepted_by_project_manager' ||
                  item.action === 'accept' ||
                  item.action === 'update' ||
                  item.action === 'set_by_supervisor' ||
                  item.action === 'rejected_by_project_manager')
            ).length > 0 &&
            (stepGeneralLog || stepGransLog) ? (
              <>
                {FEATURE_PROJECT_PATH_NEW ? (
                  <ProjectManagerRev
                    isConsultation={isConsultation}
                    stepGeneralLog={stepGeneralLog ?? stepGransLog}
                  />
                ) : (
                  <ProjectManager
                    isConsultation={isConsultation}
                    stepGeneralLog={stepGeneralLog ?? stepGransLog}
                  />
                )}
              </>
            ) : null}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
                (item.user_role === 'PROJECT_SUPERVISOR' || item.state === 'PROJECT_SUPERVISOR') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'project_completed' &&
                item.action !== 'sending_closing_report' &&
                item.action !== 'send_revised_version' &&
                item.action !== 'complete_payment' &&
                item.action !== 'reject'
            ).length > 0 &&
            isConsultation === false &&
            stepGeneralLog ? (
              // <SupervisorGeneral stepGeneralLog={stepGeneralLog} />
              <>
                {FEATURE_PROJECT_PATH_NEW ? (
                  <SupervisorGeneralRev stepGeneralLog={stepGeneralLog} />
                ) : (
                  <SupervisorGeneral stepGeneralLog={stepGeneralLog} />
                )}
              </>
            ) : null}
            {/*  */}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
                (item.user_role === 'PROJECT_SUPERVISOR' || item.state === 'PROJECT_SUPERVISOR') &&
                item.action !== 'send_back_for_revision' &&
                item.action !== 'step_back' &&
                item.action !== 'project_completed' &&
                item.action !== 'sending_closing_report' &&
                item.action !== 'complete_payment' &&
                item.action !== 'send_revised_version' &&
                item.action !== 'reject'
            ).length > 0 &&
            isConsultation &&
            stepGransLog ? (
              // <SupervisorGrants stepGransLog={stepGransLog} />
              <>
                {FEATURE_PROJECT_PATH_NEW ? (
                  <SupervisorGrantsRev stepGransLog={stepGransLog} />
                ) : (
                  <SupervisorGrants stepGransLog={stepGransLog} />
                )}
              </>
            ) : null}
            {/*  */}
            {/*  */}
            {logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
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

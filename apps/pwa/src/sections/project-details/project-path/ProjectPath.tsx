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
import useResponsive from 'hooks/useResponsive';
import { getTracks } from 'queries/commons/getTracks';
import {
  FEATURE_AMANDEMENT_FROM_FINANCE,
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
import RevisionLog from './role-logs/RevisionLog';

function ProjectPath() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const isMobile = useResponsive('down', 'md');
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const [logs, setLogs] = React.useState<Log[]>();

  const [activeStep, setActiveStep] = React.useState<string>('-1');
  const [stepGransLog, setGransLog] = React.useState<PropsalLogGrants | null>(null);
  const [stepGeneralLog, setGeneralLog] = React.useState<PropsalLog | null>(null);
  const [isPayments, setIsPayments] = React.useState(false);

  const isConsultation = (proposal && proposal.track && proposal.track.is_grant) ?? false;
  const isCashier =
    proposal?.payments?.every((item) => item.status === 'done') &&
    proposal.inner_status === 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR';

  const { id: proposal_id } = useParams();
  const [result] = useQuery({
    query: getProposalLog,
    variables: { proposal_id },
  });

  const [tracks] = useQuery({
    query: getTracks,
    variables: {},
  });

  const { data: followUps, fetching, error } = result;
  const { data: listTracks, fetching: fetchingTracks, error: errorTracks } = tracks;
  const handleStep = (step: string, item: Log | undefined) => () => {
    window.scrollTo(115, 115);
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
  };
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
    if (
      insertPayment &&
      insertPayment.length > 0 &&
      !['ASKED_FOR_AMANDEMENT_PAYMENT'].includes(proposal.outter_status)
    ) {
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

    setGransLog((current) => {
      const tmpData = { ...current };
      return {
        ...current,
        new_values: tmpLogs[tmpLogs.length - 1]?.new_values,
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

  return (
    <Grid container>
      <Grid item xs={12} md={4} sx={{ backgroundColor: '#fff' }}>
        <Stack
          direction="column"
          spacing={4}
          justifyContent="start"
          sx={{
            paddingBottom: '10px',
            width: '100%',
            '> :not(style)+:not(style)': {
              mt: '16px !important',
            },
          }}
        >
          <Typography variant="h6" sx={{ px: 3, pt: 2 }}>
            مسار المشروع
          </Typography>
          {(!logs || logs.length === 0) && (
            <Typography variant="body1">{translate('errors.no_project_path')}</Typography>
          )}
          <Box
            sx={{
              width: '100%',
              padding: '10px',
              maxHeight: '180vh',
              overflowY: 'scroll',
            }}
          >
            <Stepper
              activeStep={logs && logs.length}
              orientation={isMobile ? 'horizontal' : 'vertical'}
              sx={{ alignItems: 'flex-start' }}
            >
              {logs &&
                logs.length > 0 &&
                logs.map((item: Log, index: number) => (
                  <Step key={index}>
                    <Stack component="div">
                      <Button
                        sx={{
                          padding: '0px',
                          justifyContent: 'start',
                          ':hover': { backgroundColor: '#fff' },
                          minWidth: '105px !important',
                        }}
                        onClick={handleStep(item?.id || '-1', item)}
                      >
                        <Stack
                          direction={{ xs: 'column', md: 'row' }}
                          justifyContent={{ xs: 'flex-start', md: 'center' }}
                          spacing={2}
                        >
                          <PanoramaFishEyeTwoToneIcon
                            color={activeStep === item.id ? 'primary' : 'disabled'}
                            sx={{
                              alignSelf: { xs: 'flex-start', md: 'center' },
                            }}
                          />
                          <Stack spacing={0.25}>
                            <Typography
                              sx={{
                                fontSize: activeStep === item.id ? '14px' : '12px',
                                fontWeight: activeStep === item.id ? 800 : 600,
                                color: '#000',
                                alignSelf: 'flex-start',
                                textAlign: {
                                  xs: currentLang && currentLang.value === 'en' ? 'left' : 'right',
                                },
                              }}
                            >
                              {translate(`permissions.${item.user_role ?? item.state}`)}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: activeStep === item.id ? '14px' : '12px',
                                fontWeight: activeStep === item.id ? 800 : 600,
                                color: '#000',
                                alignSelf: 'flex-start',
                                textAlign: {
                                  xs: currentLang && currentLang.value === 'en' ? 'left' : 'right',
                                },
                              }}
                            >
                              {(item.user_role === 'CLIENT' &&
                                (item?.old_values?.user?.client_data?.entity ||
                                  item?.reviewer?.employee_name)) ||
                                item?.reviewer?.employee_name ||
                                proposal?.user?.client_data?.entity ||
                                proposal?.user?.employee_name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#000',
                                alignSelf: 'flex-start',
                                textAlign: {
                                  xs: currentLang && currentLang.value === 'en' ? 'left' : 'right',
                                },
                              }}
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
                                  {[
                                    'ASKED_FOR_AMANDEMENT',
                                    'ASKED_FOR_AMANDEMENT_PAYMENT',
                                  ].includes(proposal.outter_status)
                                    ? translate(`permissions.PROJECT_SUPERVISOR`)
                                    : translate(`permissions.${proposal.state}`)}
                                </Typography>
                              </Stack>
                            )}
                            {isCashier && (
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
                                  {translate(`permissions.CASHIER`)}
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
        <Grid
          item
          xs={12}
          md={8}
          sx={{ backgroundColor: 'transparent', px: { xs: 0, md: 6 }, mt: 3 }}
        >
          <Stack direction="column" spacing={2} justifyContent="start">
            {isCompleted && activeStep === '-1' ? (
              <Typography variant="h6">{translate(`review.complete`)}</Typography>
            ) : (
              <Typography variant="h6">{translate(`review.order_status`)}</Typography>
            )}

            {activeStep !== '-1' ? (
              logs
                .filter((item: Log, index: number) => item.id === activeStep)
                .map((item: Log, index: number) => {
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

            <React.Fragment>
              {(isCompleted && activeStep === '-1') ||
              (logs[logs.length - 1].id === activeStep &&
                stepGeneralLog?.state === 'CLIENT' &&
                stepGeneralLog?.user_role === 'CLIENT')
                ? null
                : logs
                    .filter((item: Log, index: number) => activeStep === item.id)
                    .map((item: Log, index: number) => (
                      <>
                        {item.notes &&
                        (item.action === 'reject' ||
                          item.action === 'send_back_for_revision' ||
                          item.action === 'send_revised_version' ||
                          item.action === 'step_back' ||
                          item.action === 'one_step_back' ||
                          item.action === 'rejected_by_project_manager' ||
                          item.action === 'study_again' ||
                          item.action === 'accept_and_ask_for_consultation' ||
                          item.action === 'ask_for_amandement_request' ||
                          (item.action === 'accept' && item.user_role === 'MODERATOR')) ? (
                          <Stack key={index} direction="column" gap={2}>
                            <Typography variant="h6">{translate(`review.notes`)}</Typography>
                          </Stack>
                        ) : null}
                      </>
                    ))}

              {activeStep === '-1' && !stepGeneralLog && !stepGransLog ? (
                <Typography variant="h6">{translate(`review.notes`)}</Typography>
              ) : null}
              {activeStep !== '-1' ? (
                logs
                  .filter((item: Log, index: number) => activeStep === item.id)
                  .map((item: Log, index: number) => (
                    <React.Fragment key={index}>
                      {item.notes === 'Proposal has been revised' ? (
                        <Stack direction="column" spacing={2} sx={{ pb: 2 }}>
                          <Typography>{translate('proposal_has_been_revised')}</Typography>
                        </Stack>
                      ) : (item.action === 'accept' || item.action === 'update') &&
                        (item.user_role === 'PROJECT_MANAGER' ||
                          item.user_role === 'CEO' ||
                          item.user_role === 'PROJECT_SUPERVISOR') ? null : (
                        <Stack direction="column" spacing={2} sx={{ pb: 2 }}>
                          <Typography>{item.notes}</Typography>
                        </Stack>
                      )}
                    </React.Fragment>
                  ))
              ) : (
                <>
                  {logs[logs.length - 1].id === activeStep &&
                  stepGeneralLog?.state === 'CLIENT' &&
                  activeStep !== '-1' ? null : (
                    <Typography>
                      {!IsPaymentAction(logs[logs.length - 1].action) &&
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
                        : '-'}
                    </Typography>
                  )}
                </>
              )}
              {logs
                .filter((item: Log, index: number) => activeStep === item.id)
                .map((item: Log, index: number) => (
                  <Stack key={index} direction="column" gap={2}>
                    {item.reject_reason && item.action === 'reject' ? (
                      <>
                        <Typography variant="h6">{translate(`review.reject_reason`)}</Typography>
                        <Typography>{item.reject_reason || '-'}</Typography>
                      </>
                    ) : null}
                  </Stack>
                ))}
            </React.Fragment>

            {isCompleted && activeStep === '-1' ? null : <Divider />}

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
                item.action !== 'reject' &&
                item.action !== 'ask_for_amandement_request' &&
                item.action !== 'send_revision_for_finance_amandement' &&
                item.action !== 'send_revision_for_supervisor_amandement'
            ).length > 0 &&
            isConsultation === false &&
            stepGeneralLog ? (
              <>
                {FEATURE_PROJECT_PATH_NEW ? (
                  <SupervisorGeneralRev stepGeneralLog={stepGeneralLog} />
                ) : (
                  <SupervisorGeneral stepGeneralLog={stepGeneralLog} />
                )}
              </>
            ) : null}
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
                item.action !== 'reject' &&
                item.action !== 'ask_for_amandement_request' &&
                item.action !== 'send_revision_for_finance_amandement' &&
                item.action !== 'send_revision_for_supervisor_amandement'
            ).length > 0 &&
            isConsultation &&
            stepGransLog ? (
              <>
                {FEATURE_PROJECT_PATH_NEW ? (
                  <SupervisorGrantsRev stepGransLog={stepGransLog} />
                ) : (
                  <SupervisorGrants stepGransLog={stepGransLog} />
                )}
              </>
            ) : null}
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
            {FEATURE_AMANDEMENT_FROM_FINANCE &&
            logs.filter(
              (item: Log, index: number) =>
                activeStep === item.id &&
                (item.action === 'send_revision_for_finance_amandement' ||
                  item.action === 'send_revision_for_supervisor_amandement')
            ).length > 0 &&
            stepGeneralLog ? (
              <RevisionLog stepGeneralLog={stepGeneralLog} />
            ) : null}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}

export default ProjectPath;

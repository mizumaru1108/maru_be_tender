import * as React from 'react';
import { Grid, Stack, Typography, Box, Stepper, Step, Button, Divider } from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { getProposalLog } from 'queries/commons/getPrposalLog';
import Page500 from 'pages/Page500';
import { Link } from 'react-router-dom';
import { getProposals } from 'queries/commons/getProposal';
import moment from 'moment';
import useAuth from 'hooks/useAuth';

type Role =
  | 'CLIENT'
  | 'MODERATOR'
  | 'PROJECT_SUPERVISOR'
  | 'PROJECT_MANAGER'
  | 'CEO'
  | 'FINANCE'
  | 'CASHIER';

type Log = {
  message: string;
  notes: string;
  action: 'accept' | 'reject' | 'pending' | 'accept_and_need_consultant' | 'one_step_back';
  created_at: Date;
  user_role: Role;
  proposal: {
    clasification_field: string;
    clause: string;
    closing_report: boolean;
    does_an_agreement: boolean;
    inclu_or_exclu: boolean;
    number_of_payments_by_supervisor: number;
    fsupport_by_supervisor: string;
    support_outputs: string;
    support_type: boolean;
    support_goal_id: string;
    need_picture: boolean;
    vat: boolean;
    vat_percentage: number;
    created_at: any;
    updated_at: any;
    state: string;
  };
};

function ProjectPath() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepOn, setStepOn] = React.useState(1);
  const [stepUserRole, setStepUserRole] = React.useState('');
  const { id: proposal_id } = useParams();
  const [result] = useQuery({
    query: getProposalLog,
    variables: { proposal_id },
  });

  // const valueLocale = localStorage.getItem('i18nextLng');

  const { data: followUps, fetching, error } = result;
  const handleStep = (step: number, item: Log) => () => {
    window.scrollTo(115, 115);
    setStepOn(step);
    setActiveStep(step);

    if (item !== undefined) {
      setStepUserRole(item.user_role);
    } else {
      // setStepUserRole(followUps.log[followUps.log.length - 1].proposal.state);
      setStepUserRole('');
    }
  };

  React.useEffect(() => {
    if (followUps?.log) {
      setActiveStep(followUps.log.length);
      // setActiveStep(followUps.log.length - 1);

      // setStepUserRole(
      //   followUps?.log.length ? followUps.log[followUps.log.length - 1].user_role : ''
      // );
    }
    // getDay();
  }, [followUps]);

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
                    <Typography>{item.action}</Typography>
                  </Stack>
                )}
              </React.Fragment>
            ))
          ) : (
            <Typography>Waiting review...</Typography>
          )}
          {stepUserRole !== 'PROJECT_SUPERVISOR' && (
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
                <Typography>Waiting review...</Typography>
              )}
            </React.Fragment>
          )}
          <Divider />
          {stepUserRole !== 'PROJECT_SUPERVISOR' ? null : (
            <React.Fragment>
              <Typography variant="h6">{translate(`review.review_by_supervisor`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>
                          {translate('project_already_reviewed_by_supervisor')}{' '}
                          {moment(item.proposal.updated_at)
                            .locale(`${currentLang.value}`)
                            .fromNow()}
                        </Typography>
                      </Stack>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.closing_report`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.closing_report
                                ? `${translate('review.yes')}`
                                : `${translate('review.no')}`}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.closing_agreement`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.does_an_agreement
                                ? `${translate('review.yes')}`
                                : `${translate('review.no')}`}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.vat_in_project`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.vat
                                ? `${translate('review.yes')}`
                                : `${translate('review.no')}`}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.vat`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>{item.proposal.vat_percentage || 0}</Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.inclu_or_exclu`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.inclu_or_exclu
                                ? `${translate('review.yes')}`
                                : `${translate('review.no')}`}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.number_of_payment`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.number_of_payments_by_supervisor}{' '}
                              {translate('review.sar')}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.payment_support`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.fsupport_by_supervisor} {translate('review.sar')}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.support_amount_inclu`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                            <Typography>
                              {item.proposal.support_type
                                ? `${translate('review.yes')}`
                                : `${translate('review.no')}`}
                            </Typography>
                          </Stack>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              <Typography variant="h6">{translate(`review.procedure`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>
                          {translate(`review.support_goals.${item.proposal.support_goal_id}`)}
                        </Typography>
                      </Stack>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
              <Typography variant="h6">{translate(`review.note_on_project`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.notes}</Typography>
                      </Stack>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
              <Typography variant="h6">{translate(`review.support_output`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.support_outputs}</Typography>
                      </Stack>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            </React.Fragment>
          )}

          {/* <Stack direction="row" justifyContent="center">
            <Link
              style={{ color: '#A4A4A4' }}
              onClick={() => {
                console.info("I'm a button.");
              }}
              to={''}
            >
              {translate(`show_modified_fields`)}
            </Link>
          </Stack> */}
        </Stack>
      </Grid>
      <Grid item md={4} xs={4} sx={{ backgroundColor: '#fff' }}>
        <Stack direction="column" gap={2} justifyContent="start" sx={{ paddingBottom: '10px' }}>
          <Typography variant="h6">مسار المشروع</Typography>
          <Box sx={{ width: '100%', padding: '10px', maxHeight: '450px', overflowY: 'scroll' }}>
            <Stepper
              activeStep={
                activeRole! === 'tender_moderator' ? followUps.log.length - 1 : followUps.log.length
              }
              orientation="vertical"
            >
              {followUps.log.map((item: Log, index: number) => (
                <Step key={index}>
                  <Stack direction="row" gap={2}>
                    {/* {followUps.log.length === 1 && followUps.log[0] === 'Moderator' ? (
                      <CircleIcon sx={{ color: '#0E8478', alignSelf: 'center' }} />
                    ) : (
                      <PanoramaFishEyeIcon sx={{ color: '#000', alignSelf: 'center' }} />
                    )} */}
                    <PanoramaFishEyeIcon sx={{ color: '#000', alignSelf: 'center' }} />
                    <Stack sx={{ direction: 'column', alignSelf: 'start' }}>
                      <Button
                        sx={{
                          padding: '0px',
                          justifyContent: 'start',
                          ':hover': { backgroundColor: '#fff' },
                        }}
                        onClick={handleStep(index, item)}
                      >
                        <Typography
                          sx={{
                            fontSize: index === activeStep ? '17px' : '12px',
                            fontWeight: index === activeStep ? 800 : 400,
                            color: '#000',
                            alignSelf: 'center',
                          }}
                        >
                          {translate(`permissions.${item.user_role}`)}
                        </Typography>
                      </Button>
                      <Typography sx={{ fontSize: '12px' }}>
                        {formattedDateTime(item.created_at)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Step>
              ))}
              {followUps.log.length ? (
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
                        onClick={handleStep(
                          followUps.log.length,
                          followUps.log[followUps.log.length]
                        )}
                      >
                        <Typography
                          sx={{
                            fontSize: followUps.log.length === activeStep ? '17px' : '12px',
                            fontWeight: followUps.log.length === activeStep ? 800 : 400,
                            color: '#000',
                            alignSelf: 'center',
                          }}
                        >
                          {translate(
                            `permissions.${followUps.log[followUps.log.length - 1].proposal.state}`
                          )}
                        </Typography>
                      </Button>
                    </Stack>
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
            </Stepper>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default ProjectPath;

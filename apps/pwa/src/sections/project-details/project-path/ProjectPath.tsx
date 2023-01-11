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
  };
};

function ProjectPath() {
  const { translate } = useLocales();
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepOn, setStepOn] = React.useState(1);
  const { id: proposal_id } = useParams();
  const [result] = useQuery({
    query: getProposalLog,
    variables: { proposal_id },
  });

  const { data: followUps, fetching, error } = result;
  const handleStep = (step: number) => () => {
    window.scrollTo(115, 115);
    setStepOn(step);
    setActiveStep(step);
  };

  React.useEffect(() => {
    if (followUps?.log) {
      setActiveStep(followUps.log.length - 1);
    }
    // getDay();
  }, [followUps]);

  if (fetching) return <>.. Loading</>;
  if (error) return <Page500 error={error.message} />;

  const getDay = (newDate: string) => {
    const dateTimeAgo = moment(new Date(newDate)).fromNow();
    return dateTimeAgo;
  };
  console.log('FOLLOW UP', result);

  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={8} sx={{ backgroundColor: 'transparent', px: 6 }}>
        <Stack direction="column" gap={2} justifyContent="start">
          <Typography variant="h6">{translate(`review.order_status`)}</Typography>
          {followUps.log.map((item: Log, index: number) => (
            <>
              {index === activeStep && (
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Typography>{item.action}</Typography>
                </Stack>
              )}
            </>
          ))}
          <Typography variant="h6">{translate(`review.classification_field`)}</Typography>
          {followUps.log.map((item: Log, index: number) => (
            <>
              {index === activeStep && (
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Typography>{item.notes}</Typography>
                </Stack>
              )}
            </>
          ))}
          <Divider />
          <Typography variant="h6">{translate(`review.review_by_supervisor`)}</Typography>
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            {followUps.log.map((item: Log, index: number) => (
              <>
                {index === activeStep && (
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      This project already reviewed by Supervisor {getDay(item.proposal.updated_at)}
                    </Typography>
                  </Stack>
                )}
              </>
            ))}
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.closing_report`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.closing_report ? 'Yes' : 'No'}</Typography>
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.closing_agreement`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.does_an_agreement ? 'Yes' : 'No'}</Typography>
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.vat_in_project`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.vat ? 'Yes' : 'No'}</Typography>
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.vat`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.vat_percentage || 0}</Typography>
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.inclu_or_exclu`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.inclu_or_exclu ? 'Yes' : 'No'}</Typography>
                        {/* <Typography>{item.clasification_field}</Typography> */}
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.number_of_payment`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>
                          {item.proposal.number_of_payments_by_supervisor} SAR
                        </Typography>
                        {/* <Typography>{item.clasification_field}</Typography> */}
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.payment_support`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.fsupport_by_supervisor} SAR</Typography>
                        {/* <Typography>{item.clasification_field}</Typography> */}
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{translate(`review.support_amount_inclu`)}</Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {followUps.log.map((item: Log, index: number) => (
                  <>
                    {index === activeStep && (
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{item.proposal.support_type ? 'Yes' : 'No'}</Typography>
                        {/* <Typography>{item.clasification_field}</Typography> */}
                      </Stack>
                    )}
                  </>
                ))}
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="h6">{translate(`review.procedure`)}</Typography>
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            {followUps.log.map((item: Log, index: number) => (
              <>
                {index === activeStep && (
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>{item.proposal.support_goal_id}</Typography>
                  </Stack>
                )}
              </>
            ))}
          </Stack>
          <Typography variant="h6">{translate(`review.note_on_project`)}</Typography>
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            {followUps.log.map((item: Log, index: number) => (
              <>
                {index === activeStep && (
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>{item.notes}</Typography>
                    {/* <Typography>{item.clasification_field}</Typography> */}
                  </Stack>
                )}
              </>
            ))}
          </Stack>
          <Typography variant="h6">{translate(`review.support_output`)}</Typography>
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            {followUps.log.map((item: Log, index: number) => (
              <>
                {index === activeStep && (
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>{item.proposal.support_outputs}</Typography>
                    {/* <Typography>{item.clasification_field}</Typography> */}
                  </Stack>
                )}
              </>
            ))}
          </Stack>
          <Stack direction="row" justifyContent="center">
            <Link
              style={{ color: '#A4A4A4' }}
              onClick={() => {
                console.info("I'm a button.");
              }}
              to={''}
            >
              {translate(`show_modified_fields`)}
            </Link>
          </Stack>
        </Stack>
      </Grid>
      <Grid item md={4} xs={4} sx={{ backgroundColor: '#fff' }}>
        <Stack direction="column" gap={2} justifyContent="start" sx={{ paddingBottom: '10px' }}>
          <Typography variant="h6">مسار المشروع</Typography>
          <Box sx={{ width: '100%', padding: '10px', maxHeight: '450px', overflowY: 'scroll' }}>
            <Stepper activeStep={followUps.log.length - 1} orientation="vertical">
              {followUps.log.map((item: Log, index: number) => (
                <Step key={index}>
                  <Button
                    sx={{ padding: '0px', ':hover': { backgroundColor: '#fff' } }}
                    onClick={handleStep(index)}
                  >
                    <Stack direction="row" gap={2}>
                      {index === activeStep ? (
                        <PanoramaFishEyeIcon sx={{ color: '#000', alignSelf: 'center' }} />
                      ) : (
                        <CircleIcon sx={{ alignSelf: 'center' }} />
                      )}

                      <Typography
                        sx={{
                          fontSize: index === activeStep ? '17px' : '12px',
                          fontWeight: index === stepOn ? 800 : 400,
                          color: '#000',
                          alignSelf: 'center',
                        }}
                      >
                        {translate(`permissions.${item.user_role}`)}
                      </Typography>
                    </Stack>
                  </Button>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default ProjectPath;

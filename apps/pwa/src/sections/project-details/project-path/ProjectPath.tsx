import * as React from 'react';
import {
  Grid,
  Stack,
  Typography,
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import { getFollowUps } from 'queries/client/getFollowUps';
import useLocales from 'hooks/useLocales';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { getProposalLog } from 'queries/commons/getPrposalLog';
import Page500 from 'pages/Page500';

type Role =
  | 'CLIENT'
  | 'MODERATOR'
  | 'PROJECT_SUPERVISOR'
  | 'PROJECT_MANAGER'
  | 'CEO'
  | 'FINANCE'
  | 'CASHIER';

const steps = [
  'CLIENT',
  'MODERATOR',
  'PROJECT_SUPERVISOR',
  'PROJECT_MANAGER',
  'CEO',
  'FINANCE',
  'CASHIER',
];

type Log = {
  message: string;
  notes: string;
  action: 'accept' | 'reject' | 'pending' | 'accept_and_need_consultant' | 'one_step_back';
  user_role: Role;
};
function ProjectPath({ data }: any) {
  const [userTypeId, setUserTypeId] = React.useState(data?.state);
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
  }, [followUps]);

  if (fetching) return <>.. Loading</>;
  if (error) return <Page500 error={error.message} />;

  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={8} sx={{ backgroundColor: 'transparent' }}>
        <Stack direction="column" gap={2} justifyContent="start">
          <Typography variant="h6">حالة الطلب</Typography>
          {followUps.log.map((item: Log, index: number) => (
            <>
              {index === activeStep && (
                <Stack direction="column" gap={2} sx={{ padding: '10px' }}>
                  <Typography>{item.message}</Typography>
                  <Divider />
                  {item.notes && (
                    <Stack direction="column" gap={1} sx={{ padding: '10px' }}>
                      <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>
                        الملاحظة المرسلة:
                      </Typography>
                      <Typography sx={{ color: '#000', fontSize: '15px' }}>{item.notes}</Typography>
                    </Stack>
                  )}
                </Stack>
              )}
            </>
          ))}
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

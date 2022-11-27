import * as React from 'react';
import { Grid, Stack, Typography, Box, Stepper, Step, StepButton } from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import { getFollowUps } from 'queries/client/getFollowUps';
import useLocales from 'hooks/useLocales';
import FollowUpsAction from './FollowUpsAction';
import FollowUpsFile from './FollowUpsFile';
type Employees =
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

function ProjectPath({ data }: any) {
  const [userTypeId, setUserTypeId] = React.useState(data?.state);
  const { translate } = useLocales();
  const [activeStep, setActiveStep] = React.useState(1);
  const [stepOn, setStepOn] = React.useState(1);
  const { id: proposal_id } = useParams();
  const [result] = useQuery({
    query: getFollowUps,
    variables: {
      where: {
        proposal_id: { _eq: proposal_id },
        _and: {
          employee: { user_type_id: { _eq: userTypeId } },
        },
      },
    },
  });

  const { data: followUps, fetching, error } = result;
  const handleStep = (step: number) => () => {
    window.scrollTo(0, 0);
    setStepOn(step);
    setUserTypeId(steps[step]);
  };

  React.useEffect(() => {
    setActiveStep(steps.indexOf(data?.state as Employees));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeId]);
  if (fetching) return <>... Loading</>;
  return <></>;
  // return (
  //   <Grid container spacing={2}>
  //     <Grid item md={8} xs={8} sx={{ backgroundColor: 'transparent' }}>
  //       <Stack direction="column" gap={2} justifyContent="start">
  //         <Typography variant="h6">حالة الطلب</Typography>
  //         {followUps.proposal_follow_up.map((item: any, index: any) => (
  //           <div key={index}>
  //             {item.action && <FollowUpsAction created_at={item.created_at} action={item.action} />}
  //             {item.file && <FollowUpsFile created_at={item.created_at} file={item.file} />}
  //           </div>
  //         ))}
  //       </Stack>
  //     </Grid>
  //     <Grid item md={4} xs={4} sx={{ backgroundColor: '#fff' }}>
  //       <Stack direction="column" gap={2} justifyContent="start">
  //         <Typography variant="h6">مسار المشروع</Typography>
  //         <Box sx={{ width: '100%' }}>
  //           <Stepper activeStep={activeStep} orientation="vertical">
  //             {steps.map((label, index) => (
  //               <Step key={label}>
  //                 <StepButton color="inherit" onClick={handleStep(index)}>
  //                   <Stack direction="column">
  //                     <Typography
  //                       sx={{ fontSize: '12px', fontWeight: index === stepOn ? 800 : 400 }}
  //                     >
  //                       {translate(label)}
  //                     </Typography>
  //                     <Typography sx={{ color: '#93A3B0' }}>0 تعديلات</Typography>
  //                   </Stack>
  //                 </StepButton>
  //               </Step>
  //             ))}
  //           </Stepper>
  //         </Box>
  //       </Stack>
  //     </Grid>
  //   </Grid>
  // );
}

export default ProjectPath;

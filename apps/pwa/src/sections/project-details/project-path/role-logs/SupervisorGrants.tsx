import { Grid, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { PropsalLogGrants } from '../../../../@types/proposal';

interface Props {
  stepGransLog: PropsalLogGrants;
}

function SupervisorGrants({ stepGransLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Stack direction="column" gap={2} sx={{ pb: 2, px: 2 }}>
          <Typography>
            {translate('project_already_reviewed_by_supervisor')}{' '}
            {moment(stepGransLog.updated_at).locale(`${currentLang.value}`).fromNow()}
          </Typography>
        </Stack>
        {Object.entries(stepGransLog.proposal!).map(([key, value]) => {
          // console.log({ stepGransLog });
          if (key === 'created_at' || key === 'updated_at') {
            return null; // Exclude these properties from rendering
          }
          // if (!value) {
          //   return null;
          // }
          if (key === 'created_at' || key === 'updated_at') {
            return null; // Exclude these properties from rendering
          }
          if (key === 'support_goal_id') {
            return (
              <Grid item xs={6} key={key}>
                <Typography variant="h6">
                  {
                    // key
                    translate(`review.${key}`)
                  }
                </Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Typography>{translate(`review.support_goals.${String(value)}`)}</Typography>
                </Stack>
              </Grid>
            );
          }
          return (
            <Grid item xs={6} key={key}>
              <Typography variant="h6">
                {
                  // key
                  translate(`review.${key}`)
                }
              </Typography>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{value ? String(value) : '-'}</Typography>
              </Stack>
            </Grid>
          );
        })}
        <Grid item xs={6}>
          <Typography variant="h6">
            {
              // key
              translate(`review.notes`)
            }
          </Typography>
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            <Typography>{stepGransLog.notes ?? '-'}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default SupervisorGrants;
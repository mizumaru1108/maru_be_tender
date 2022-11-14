import { Container, Grid, Typography, useTheme } from '@mui/material';
import { getFollowUps } from 'queries/client/getFollowUps';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsAction from './FollowUpsAction';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';

function FollowUps() {
  const { id } = useParams();
  const [result, mutate] = useQuery({
    query: getFollowUps,
    variables: {
      where: {
        proposal_id: { _eq: id },
        _and: { user_id: { _is_null: false } },
      },
    },
  });
  const { data, fetching, error } = result;

  useEffect(() => {}, [data]);
  if (fetching) return <>... Loading</>;
  if (error) return <>... Opss something went Wrong</>;
  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <Typography variant="h6">متابعات المشروع</Typography>
      </Grid>
      {data.proposal_follow_up.length === 0 && (
        <Grid item md={12} xs={12}>
          <EmptyFollowUps />
        </Grid>
      )}
      {data.proposal_follow_up.length !== 0 && (
        <>
          {data.proposal_follow_up.map((item: any, index: any) => (
            <Grid item md={12} xs={12} key={index}>
              {item.file && <FollowUpsFile {...item} />}
              {item.action && <FollowUpsText {...item} />}
            </Grid>
          ))}
        </>
      )}
      <Grid
        item
        md={12}
        xs={12}
        sx={{
          bottom: 24,
          position: 'sticky',
        }}
      >
        {/* <FollowUpsAction mutate={mutate} /> */}
      </Grid>
    </Grid>
  );
}

export default FollowUps;

import { Grid, Typography } from '@mui/material';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';
import { useSelector } from 'redux/store';
import React from 'react';

function ClientFollowUpsPage() {
  const { proposal } = useSelector((state) => state.proposal);
  const dates = new Set();

  function formattedDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return (
    <Grid container spacing={3}>
      {proposal.follow_ups.length === 0 ? (
        <Grid item md={12} xs={12}>
          <EmptyFollowUps />
        </Grid>
      ) : (
        proposal.follow_ups.map((item: any, index: any) => (
          <Grid item md={12} xs={12} key={index}>
            {item.employee_only === false && (
              <React.Fragment>
                {!dates.has(formattedDate(new Date(item.created_at))) && (
                  <React.Fragment>
                    <Typography sx={{ textAlign: 'center', color: '#A4A4A4', mb: 2 }}>
                      {formattedDate(new Date(item.created_at))}
                    </Typography>
                    <Typography visibility="hidden">
                      <>{dates.add(formattedDate(new Date(item.created_at)))}</>
                    </Typography>
                  </React.Fragment>
                )}
                {item.attachments && <FollowUpsFile {...item} />}
                {item.content && <FollowUpsText {...item} />}
              </React.Fragment>
            )}
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default ClientFollowUpsPage;

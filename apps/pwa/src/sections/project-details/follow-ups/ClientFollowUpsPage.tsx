import { Grid } from '@mui/material';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';
import { useSelector } from 'redux/store';

function ClientFollowUpsPage() {
  const { proposal } = useSelector((state) => state.proposal);

  return (
    <Grid container spacing={3}>
      {proposal.follow_ups.length === 0 ? (
        <Grid item md={12} xs={12}>
          <EmptyFollowUps />
        </Grid>
      ) : (
        proposal.follow_ups.map((item: any, index: any) => (
          <Grid item md={12} xs={12} key={index}>
            {item.file && <FollowUpsFile {...item} />}
            {item.action && <FollowUpsText {...item} />}
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default ClientFollowUpsPage;

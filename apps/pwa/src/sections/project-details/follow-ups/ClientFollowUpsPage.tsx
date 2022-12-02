import { Grid } from '@mui/material';
import { useQuery } from 'urql';
import { getFollowUpsClient } from 'queries/client/getFollowUps';
import { useParams } from 'react-router';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';

function ClientFollowUpsPage() {
  const { id } = useParams();

  const [result] = useQuery({
    query: getFollowUpsClient,
    variables: {
      proposal_id: id,
    },
  });

  const { data, fetching, error } = result;

  if (fetching) return <>... Loading</>;

  if (error) return <>... Opss something went Wrong</>;
  return (
    <Grid container spacing={3}>
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
    </Grid>
  );
}

export default ClientFollowUpsPage;

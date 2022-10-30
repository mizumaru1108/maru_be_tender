import { Container, Typography, Box, Button, Grid, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import useAuth from 'hooks/useAuth';
import { deleteDraftProposal } from 'queries/client/deleteDraftProposal';
import { gettingSavedProjects } from 'queries/client/gettingSavedProjects';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery } from 'urql';

function DraftProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = user!;
  const [result, reexecuteQuery] = useQuery({
    query: gettingSavedProjects,
    variables: { id },
  });
  const [_, deleteDrPro] = useMutation(deleteDraftProposal);
  const { data, fetching, error } = result;

  const props = data?.data[0] ?? null;

  if (fetching) {
    return <>...Loading</>;
  }
  if (!props) return <></>;

  const delelteDraft = async (id: string) => {
    const res = await deleteDrPro({ id });
    reexecuteQuery();
  };

  const completeDraftProposal = (id: string) => {
    navigate('/client/dashboard/funding-project-request', { state: { id } });
  };
  return (
    <Container>
      <Typography variant="h4">مشاريع محفوظة كمسودة</Typography>
      <Grid container sx={{ pt: 2 }} spacing={5}>
        {data.data.map(
          (
            item: { id: string; project_name: string; project_idea: string; created_at: string },
            index: any
          ) => (
            <Grid item md={6} xs={12} key={index}>
              <Card sx={{ backgroundColor: '#fff' }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    color="#000"
                    gutterBottom
                    sx={{ fontSize: '15px !important' }}
                  >
                    {item.project_name}
                  </Typography>
                  <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                    فكرة المشروع
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="#1E1E1E">
                    {item.project_idea}
                  </Typography>
                  <Divider />
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: '30px' }}>
                  <Stack direction="column" justifyContent={'space-between'}>
                    <Typography
                      variant="h6"
                      color="#93A3B0"
                      gutterBottom
                      sx={{ fontSize: '10px !important' }}
                    >
                      الإنشاء منذ
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#1E1E1E"
                      gutterBottom
                      sx={{ fontSize: '15px !important' }}
                    >
                      {`${new Date().getDate() - new Date(item.created_at).getDate()} يوم`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={2}>
                    <Button
                      variant="outlined"
                      sx={{ borderColor: 'red', color: 'red' }}
                      onClick={() => {
                        delelteDraft(item.id);
                      }}
                    >
                      حذف المسودة
                    </Button>
                    <Button
                      sx={{ background: '#0E8478', color: '#fff' }}
                      onClick={() => {
                        completeDraftProposal(item.id);
                      }}
                    >
                      إكمل الطلب
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
}

export default DraftProject;

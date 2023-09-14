import {
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { deleteDraftProposal } from 'queries/client/deleteDraftProposal';
import { useNavigate } from 'react-router';
import { useMutation } from 'urql';

function DraftProject({ draft_projects, mutate }: any) {
  const { translate } = useLocales();

  const navigate = useNavigate();

  const [_, deleteDrPro] = useMutation(deleteDraftProposal);

  const delelteDraft = async (id: string) => {
    try {
      await deleteDrPro({ id });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };
  const completeDraftProposal = (id: string) => {
    navigate('/client/dashboard/funding-project-request', { state: { id } });
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">{translate('content.client.main_page.draft_projects')}</Typography>
        <Button
          sx={{
            backgroundColor: 'transparent',
            color: '#93A3B0',
            textDecoration: 'underline',
            ':hover': {
              backgroundColor: 'transparent',
            },
          }}
          onClick={() => {
            navigate('/client/dashboard/draft-funding-requests');
          }}
        >
          {translate('view_all')}
        </Button>
      </Stack>
      <Grid container sx={{ pt: 2 }} spacing={5}>
        {draft_projects.map(
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
                    {translate('content.client.main_page.project_idea')}
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
                      {translate('content.client.main_page.created_at')}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#1E1E1E"
                      gutterBottom
                      sx={{ fontSize: '15px !important' }}
                    >
                      {`${new Date().getDate() - new Date(item.created_at).getDate()} ${translate(
                        'content.client.main_page.day'
                      )}`}
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
                      {translate('content.client.main_page.delete_draft')}
                    </Button>
                    <Button
                      sx={{ background: '#0E8478', color: '#fff' }}
                      onClick={() => {
                        completeDraftProposal(item.id);
                      }}
                    >
                      {translate('content.client.main_page.complete_the_project')}
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          )
        )}
      </Grid>
    </>
  );
}

export default DraftProject;

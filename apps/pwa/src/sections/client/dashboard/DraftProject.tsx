import { Container, Typography, Box, Button, Grid, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import useAuth from 'hooks/useAuth';
import { gettingSavedProjects } from 'queries/client/gettingSavedProjects';
import { useQuery } from 'urql';

function DraftProject() {
  const { user } = useAuth();
  const { id } = user!;
  const [result, reexecuteQuery] = useQuery({
    query: gettingSavedProjects,
    variables: { id },
  });
  const { data, fetching, error } = result;

  const props = data?.proposal[0] ?? null;
  if (fetching) {
    return <>...Loading</>;
  }
  if (!props) return <></>;

  return (
    <Container>
      <Typography variant="h4">مشاريع محفوظة كمسودة</Typography>
      <Grid container sx={{ pt: 2 }}>
        <Grid item md={6}>
          <Card sx={{ backgroundColor: '#fff' }}>
            <CardContent>
              <Typography
                variant="h6"
                color="#000"
                gutterBottom
                sx={{ fontSize: '15px !important' }}
              >
                مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض
              </Typography>
              <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                فكرة المشروع
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="#1E1E1E">
                لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
                أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس
                نوستريد أكسير سيتاشن يللأمكو........
              </Typography>
              <Divider />
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: '30px' }}>
              <Stack direction="column">
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
                  5 ساعات
                </Typography>
              </Stack>
              <Box />
              <Box />
              <Button variant="outlined" sx={{ borderColor: 'red', color: 'red' }}>
                حذف المسودة
              </Button>
              <Button sx={{ background: '#0E8478', color: '#fff' }}>إكمل الطلب</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DraftProject;

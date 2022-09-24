import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Container,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';
import { useNavigate } from 'react-router';

function CurrentProject() {
  const project_exist = false;
  const navigate = useNavigate();
  const item = {
    id: '#768873',
    establishing_data1: '22.8.2022 في 15:58',
    project_state: 'في انتظار موافقة',
    project_details:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
    project_name: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
  };

  if (!project_exist) {
    return (
      <Container>
        <Typography variant="h4">المشروع الحالي</Typography>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          p="20px"
        >
          <Box sx={{ width: '100%' }}>
            <Stack justifyItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <SvgIconStyle src={`/icons/empty-project.svg`} />
              </Box>
              <Typography sx={{ textAlign: 'center' }}>لا يوجد اي مشاريع حالية</Typography>
              <Typography sx={{ textAlign: 'center' }}>
                لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
                أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .
              </Typography>
              <Button
                sx={{ textAlign: 'center', margin: '0 auto' }}
                onClick={() => {
                  // navigate(-1);
                  navigate('/client/dashboard/funding-project-request');
                }}
              >
                تقديم طلب دعم جديد
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container columnSpacing={7}>
        <Grid item md={8}>
          <Stack direction="column" gap={3}>
            <Typography variant="h4">المشروع الحالي</Typography>
            <Card sx={{ backgroundColor: '#fff' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  color="text.tertiary"
                  gutterBottom
                  sx={{ fontSize: '15px !important' }}
                >
                  {item.id}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '15px !important' }}>
                  {item.project_name}
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="column" gap={1}>
                    <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                      تاريخ الإنشاء
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                      {item.establishing_data1}
                    </Typography>
                  </Stack>
                  <Stack direction="column" gap={1}>
                    <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                      تاريخ الإنشاء
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                      {item.project_state}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  تفاصيل المشروع
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="#1E1E1E">
                  {item.project_details}
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
                <Button sx={{ background: '#0E8478', color: '#fff' }}>عرض التفاصيل</Button>
              </CardActions>
            </Card>
          </Stack>
        </Grid>
        <Grid item md={4} rowSpacing={7}>
          <Stack gap={3}>
            <Typography variant="h4">الميزانية الحالية</Typography>
            <Stack direction="column" gap={3}>
              <Stack direction="row" gap={1}>
                <Box
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    py: '30px',
                    paddingRight: '40px',
                    paddingLeft: '5px',
                  }}
                >
                  <img src={`/icons/rial-currency.svg`} alt="" />
                  <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                    الميزانية المطلوبة
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    400,000 ريال
                  </Typography>
                </Box>
                <Box
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    py: '30px',
                    paddingRight: '40px',
                    paddingLeft: '5px',
                  }}
                >
                  <img src={`/icons/rial-currency.svg`} alt="" />
                  <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                    الميزانية المطلوبة
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    400,000 ريال
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CurrentProject;

import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import useResponsive from 'hooks/useResponsive';
import { useNavigate } from 'react-router';
import BankImageComp from 'sections/shared/BankImageComp';
import useLocales from '../../hooks/useLocales';

const mockData = {
  project_name: 'اسم الشريك - جمعية الدعوة والإرشاد وتوعية الجاليات',
  minister_type: 'وزارة التجارة - تجاري',
  number_of_beni: '100',
  number_of_employees: '113',
  headquarters: 'Damascus',
  establishment_date: '10 / 11 / 2020',
  number_of_done_projects: '13',
  authority: 'وزارة الداخلية',
  license_number: '1023-0316-4648-8721',
  license_expiry_date: '10 / 08 / 2022',
  license_issue_date: '10 / 08 / 2022',
  license_file: 'image.',
};
function ModeratorProfile() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    // <Page title="My Profile">
    <Page title={translate('pages.common.my_profile')}>
      <Container>
        <ContentStyle>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" sx={{ mb: '5px' }}>
              <Typography variant="h5">{mockData.project_name}</Typography>
              <Typography variant="h6" sx={{ color: '#1E1E1E' }}>
                {mockData.minister_type}
              </Typography>
            </Stack>
            <Button
              startIcon={
                <div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_398_3192)">
                      <path
                        d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47318 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303V0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_398_3192">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              }
              sx={{
                backgroundColor: '#0169DE',
                color: '#fff',
                borderRadius: '10px',
                '&:hover': { backgroundColor: '#1482FE' },
                px: '15px',
                py: '0px',
                height: '45px',
                fontSize: isMobile ? '10px' : '15px',
              }}
              onClick={() => navigate('/client/my-profile/edit')}
            >
              تعديل معلومات الحساب
            </Button>
          </Stack>
          <Divider />
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid item md={7}>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                المعلومات الرئيسية
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>عدد المستفيدين من خدمات الجهة:</Typography>
                  <Typography sx={{ mb: '15px' }}>{mockData.number_of_beni}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>المقر</Typography>
                  <Typography>{mockData.headquarters}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>عدد موظفين بدوام كلي للمنشأة:</Typography>
                  <Typography sx={{ mb: '15px' }}>{mockData.number_of_employees}</Typography>
                  <Typography>{mockData.number_of_beni}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>تاريخ التأسيس:</Typography>
                  <Typography>{mockData.establishment_date}</Typography>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                معلومات الاتصال
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المنطقة:</Typography>
                  <Typography sx={{ mb: '15px' }}>اسم المنطقة</Typography>
                  <Typography sx={{ fontSize: '12px' }}>الموقع الإلكتروني:</Typography>
                  <Typography sx={{ mb: '15px' }}>الموقع الإلكتروني</Typography>
                  <Typography sx={{ fontSize: '12px' }}>القرية (الهجرة):</Typography>
                  <Typography sx={{ mb: '15px' }}>القرية (الهجرة)</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المحافظة:</Typography>
                  <Typography sx={{ mb: '15px' }}>المحافظة:</Typography>
                  <Typography sx={{ fontSize: '12px' }}>حساب تويتر:</Typography>
                  <Typography sx={{ mb: '15px' }}>حساب تويتر:</Typography>
                  <Typography sx={{ fontSize: '12px' }}>الجوال</Typography>
                  <Typography sx={{ mb: '15px' }}>الهاتف</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المركز (الإدارة):</Typography>
                  <Typography sx={{ mb: '15px' }}>المركز (الإدارة):</Typography>
                  <Typography sx={{ fontSize: '12px' }}>البريد الإلكتروني:</Typography>
                  <Typography sx={{ mb: '15px' }}>البريد الإلكتروني:</Typography>
                  <Typography sx={{ fontSize: '12px' }}>الهاتف</Typography>
                  <Typography sx={{ mb: '15px' }}>الهاتف</Typography>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                بيانات الإدارية
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>جوال المدير التنفيذي:</Typography>
                  <Typography sx={{ mb: '15px' }}>جوال مدخل البيانات:</Typography>
                  <Typography sx={{ fontSize: '12px' }}>جوال مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>بريد مدخل البيانات:</Typography>
                  <Typography sx={{ fontSize: '12px' }}>بريد مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>جوال مدخل البيانات:</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>اسم المدير التنفيذي:</Typography>
                  <Typography sx={{ mb: '15px' }}>اسم المدير التنفيذي:</Typography>
                  <Typography sx={{ fontSize: '12px' }}>اسم مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>اسم مدخل البيانات:</Typography>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                المعلومات البنكية
              </Typography>
              <Stack direction="row" justifyContent="space-between" gap={4}>
                <Stack direction="column" flex={3}>
                  <BankImageComp
                    enableButton={true}
                    bankName={'test'}
                    accountNumber={'000 999 888 777 666'}
                    bankAccountName={'test'}
                    borderColor={'transparent'}
                  />
                </Stack>
                <Stack direction="column" flex={3}>
                  <BankImageComp
                    enableButton={true}
                    bankName={'test'}
                    accountNumber={'000 999 888 777 666'}
                    bankAccountName={'test'}
                    borderColor={'transparent'}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid item md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1,
                  m: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>المشاريع المنجزة</Typography>
                  <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.tertiary' }}>
                    {mockData.number_of_done_projects}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: '7px' }}>
                    معلومات الترخيص
                  </Typography>

                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>رقم الترخيص:</Typography>
                    <Typography>{mockData.license_number}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تصنيف الجهة:</Typography>
                    <Typography>{mockData.authority}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تاريخ انتهاء الترخيص:</Typography>
                    <Typography>{mockData.license_expiry_date}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تاريخ اصدار الترخيص:</Typography>
                    <Typography>{mockData.license_issue_date}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>ملف الترخيص:</Typography>
                    <Typography>{mockData.license_file}</Typography>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ModeratorProfile;

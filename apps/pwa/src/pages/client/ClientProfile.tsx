import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useResponsive from 'hooks/useResponsive';
import { getProfileData } from 'queries/client/getProfileData';
import { useNavigate } from 'react-router';
import BankImageComp from 'sections/shared/BankImageComp';
import { useQuery } from 'urql';

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
function ClientProfile() {
  const { user } = useAuth();
  const [result, _] = useQuery({
    query: getProfileData,
    variables: { id: user?.id },
  });
  const { data, fetching, error } = result;

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

  if (fetching) return <>Loading ....</>;
  if (error) return <>{error.message}</>;
  const {
    user_by_pk: {
      client_data: {
        headquarters,
        authority,
        center_administration,
        ceo_mobile,
        ceo_name,
        data_entry_mail,
        data_entry_mobile,
        data_entry_name,
        date_of_esthablistmen,
        email,
        entity,
        governorate,
        license_expired,
        license_file,
        license_issue_date,
        license_number,
        num_of_beneficiaries,
        num_of_employed_facility,
        phone,
        region,
        twitter_acount,
        website,
      },
      bank_informations,
    },
    proposal_aggregate: {
      aggregate: { count: completed_projects },
    },
  } = data!;
  return (
    <Page title="My Profile">
      <Container>
        <ContentStyle>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" sx={{ mb: '5px' }}>
              <Typography variant="h5">{entity}</Typography>
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
                  <Typography sx={{ mb: '15px' }}>{num_of_beneficiaries}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>المقر</Typography>
                  <Typography>{headquarters}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>عدد موظفين بدوام كلي للمنشأة:</Typography>
                  <Typography sx={{ mb: '15px' }}>{num_of_employed_facility}</Typography>
                  <Typography>{mockData.number_of_beni}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>تاريخ التأسيس:</Typography>
                  <Typography>{date_of_esthablistmen}</Typography>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                معلومات الاتصال
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المنطقة:</Typography>
                  <Typography sx={{ mb: '15px' }}>{region}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>الموقع الإلكتروني:</Typography>
                  <Typography sx={{ mb: '15px' }}>{website}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>القرية (الهجرة):</Typography>
                  <Typography sx={{ mb: '15px' }}>القرية (الهجرة)</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المحافظة:</Typography>
                  <Typography sx={{ mb: '15px' }}>{governorate}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>حساب تويتر:</Typography>
                  <Typography sx={{ mb: '15px' }}>{twitter_acount}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>الجوال</Typography>
                  <Typography sx={{ mb: '15px' }}>{phone}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المركز (الإدارة):</Typography>
                  <Typography sx={{ mb: '15px' }}>المركز (الإدارة):</Typography>
                  <Typography sx={{ fontSize: '12px' }}>البريد الإلكتروني:</Typography>
                  <Typography sx={{ mb: '15px' }}>{email}</Typography>
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
                  <Typography sx={{ mb: '15px' }}>{ceo_mobile}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>جوال مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>{data_entry_mobile}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>بريد مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>{data_entry_mail}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>اسم المدير التنفيذي:</Typography>
                  <Typography sx={{ mb: '15px' }}>{ceo_name}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>اسم مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>{data_entry_name}</Typography>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                المعلومات البنكية
              </Typography>
              <Grid container spacing={5}>
                {bank_informations.map((item: any, index: any) => (
                  <Grid item key={index} md={6} xs={12}>
                    <BankImageComp
                      enableButton={true}
                      imageUrl={item.card_image}
                      bankName={item.bank_name}
                      accountNumber={item.bank_account_number}
                      bankAccountName={item.bank_account_name}
                    />
                  </Grid>
                ))}
              </Grid>
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
                    {completed_projects}
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
                    <Typography>{license_number}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تاريخ انتهاء الترخيص:</Typography>
                    <Typography>{license_expired}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تاريخ اصدار الترخيص:</Typography>
                    <Typography>{license_issue_date}</Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>ملف الترخيص:</Typography>
                    <Typography>
                      <a target="_blank" rel="noopener noreferrer" href={license_file}>
                        اضغط هنا لرؤية ملف الترخيص
                      </a>
                    </Typography>
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

export default ClientProfile;

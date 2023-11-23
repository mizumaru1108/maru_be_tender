import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import Page from 'components/Page';
import useResponsive from 'hooks/useResponsive';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from 'urql';
import formatPhone from 'utils/formatPhone';
import { role_url_map } from '../../@types/commons';
import { FEATURE_EDIT_CLIENT_INFORMATION } from '../../config';
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import { getNonClientDetails } from '../../queries/commons/getNonClientUserDetails';

export default function NonClientProfile() {
  const { translate, currentLang } = useLocales();

  const location = useLocation();

  const pathRole = location.pathname.split('/')[1];

  const { user, activeRole } = useAuth();

  const role = activeRole!;

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

  const userId = user?.id;

  const [{ data, fetching, error }, mutate] = useQuery({
    query: getNonClientDetails,
    variables: {
      userId,
    },
  });

  if (fetching) return <>... Loading</>;

  if (error) return <>.... somthing went wrong</>;

  return (
    <Page title={translate('user_profile.label.page_title')}>
      <Container>
        <ContentStyle>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'normal', sm: 'space-between' }}
            alignItems="center"
            spacing={2}
          >
            <Stack direction="column" spacing={2}>
              {user?.fullName && <Typography variant="h5">{user?.fullName}</Typography>}

              <Typography variant="h6" sx={{ color: '#1E1E1E' }}>
                {translate(`${role}`)}
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
                fontSize: '15px',
              }}
              disabled={!FEATURE_EDIT_CLIENT_INFORMATION}
              onClick={() => {
                if (FEATURE_EDIT_CLIENT_INFORMATION) {
                  navigate(`/${pathRole}/my-profile/edit`);
                }
              }}
            >
              {translate('user_profile.label.edit_button')}
            </Button>
          </Stack>
          <Divider />
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                {translate('user_profile.label.main_information')}
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.first_name')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {data?.profile?.employee_name || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                {translate('user_profile.label.contact_information')}
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.email')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>{data?.profile?.email || 'N/A'}</Typography>
                </Stack>

                <Stack direction="column" alignItems="start">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.phone_number')}
                  </Typography>
                  <Typography
                    sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {formatPhone({ phone: data?.profile?.mobile_number, prefix: '+966' }) || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

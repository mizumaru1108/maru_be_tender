import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import Page from 'components/Page';
import useResponsive from 'hooks/useResponsive';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useQuery } from 'urql';
import { HashuraRoles, role_url_map } from '../../@types/commons';
import { UserProfileDetails } from '../../@types/user';

import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import { getNonClientDetails } from '../../queries/commons/getNonClientUserDetails';

export default function NonClientProfile() {
  const { translate } = useLocales();
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as HashuraRoles;
  const [profile, setProfile] = useState<UserProfileDetails>({
    firstName: '',
    lastName: '',
    address: '',
    region: '',
    email: '',
    phoneNumber: '',
  });

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
  const [result, reexecuteGetOne] = useQuery({
    query: getNonClientDetails,
    variables: {
      userId,
    },
  });

  // get error, fetching, data from result
  const { data, fetching, error } = result;

  useEffect(() => {
    console.log('data', data);
    console.log('user', user);
    if (data && data.user && user) {
      setProfile({
        firstName: user.fullName || 'N/A',
        lastName: user.lastName || 'N/A',
        address: data.user[0].address || 'N/A',
        region: data.user[0].region || 'N/A',
        email: user.email || 'N/A',
        phoneNumber: data.user[0].mobileNumber || 'N/A',
      });
    }
  }, [data, user]);

  return (
    <Page title={translate('user_profile.label.page_title')}>
      <Container>
        <ContentStyle>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" sx={{ mb: '5px' }}>
              <Typography variant="h5">{user?.fullName ?? 'N/A'}</Typography>
              <Typography variant="h6" sx={{ color: '#1E1E1E' }}>
                {role_url_map[`${role}`].toUpperCase() ?? 'N/A'} - N/A
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
              {translate('user_profile.label.edit_button')}
            </Button>
          </Stack>
          <Divider />
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid item xs={7}>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                {translate('user_profile.label.main_information')}
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.first_name')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>{profile.firstName}</Typography>
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.address')}
                  </Typography>
                  <Typography>{profile.address}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.last_name')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>{profile.lastName}</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={7}>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                {translate('user_profile.label.contact_information')}
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ mb: '15px' }}>
                    {translate('user_profile.fields.region')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>{profile.region}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.email')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>{profile.email}</Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>
                    {translate('user_profile.fields.phone_number')}
                  </Typography>
                  <Typography sx={{ mb: '15px' }}>{profile.phoneNumber}</Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

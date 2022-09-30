import { Box, Button, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Iconify from '../../components/Iconify';
import ActionBar from './ActionBar';
import ExchangeDetails from './ExchangeDetails';
import FollowUps from './FollowUps';
import MainPage from './MainPage';
import Payments from './Payments';
import ProjectBudget from './ProjectBudget';
import useLocales from 'hooks/useLocales';
import useAuth from '../../hooks/useAuth';
import { hasAccess } from '../../guards/CertainRolesGuard';
import { useEffect } from 'react';
import { Role } from '../../guards/RoleBasedGuard';

function ProjectDetailsMainPage() {
  const theme = useTheme();

  // // Routes
  // const params = useParams();
  // const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTap = location.pathname.split('/').at(-1);
  const actionType = location.pathname.split('/').at(-2);

  // Logic here to get current user role
  const { user } = useAuth();

  const currentRoles = user?.registrations[0].roles[0] as Role;

  // useeffect for current roles
  useEffect(() => {
    console.log('actionType', actionType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row">
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <svg
            width="42"
            height="41"
            viewBox="0 0 42 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40.6799"
              height="41.53"
              rx="2"
              transform="matrix(-1.19249e-08 -1 -1 1.19249e-08 41.5312 40.6798)"
              fill="#93A3B0"
              fillOpacity="0.24"
            />
            <path
              d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
              fill="#1E1E1E"
            />
          </svg>
        </IconButton>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" gap={1}>
          <Typography variant="h4">
            مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض
          </Typography>
          <Typography>إنشىء بواسطة اسم مدير المشروع - تاريخ 22.8.2022 في 15:58</Typography>
        </Stack>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: '#0E847829',
            p: '5px',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: '#0E8478',
              fontSize: '15px !important',
              mt: '12px',
            }}
          >
            حالة المشروع
          </Typography>
        </Box>
      </Stack>
      <ActionBar />

      {activeTap === 'main' && <MainPage />}
      {activeTap === 'project-budget' && <ProjectBudget />}
      {activeTap === 'follow-ups' && <FollowUps />}
      {activeTap === 'payments' && <Payments />}
      {activeTap === 'exchange-details' && <ExchangeDetails />}

      {/* Floating action bar to accept and reject project */}
      {hasAccess(currentRoles, ['tender_ceo', 'tender_moderator']) &&
        activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType &&
        actionType === 'show-details' && (
          <Box
            sx={{
              backgroundColor: 'white',
              p: 3,
              borderRadius: 1,
              position: 'sticky',
              width: '100%',
              bottom: 24,
              border: `1px solid ${theme.palette.grey[400]}`,
            }}
          >
            <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
              <Stack flexDirection={{ sm: 'column', md: 'row' }}>
                <Button variant="contained" color="primary" sx={{ mr: { md: '1em' } }}>
                  {translate('activate_account')}
                </Button>
                <Button variant="contained" color="error" sx={{ my: { xs: '1.3em', md: '0' } }}>
                  {translate('delete_account')}
                </Button>
              </Stack>

              <Button
                variant="contained"
                color="info"
                endIcon={<Iconify icon="eva:edit-2-outline" />}
              >
                {translate('partner_details.submit_amendment_request')}
              </Button>
            </Stack>
          </Box>
        )}
    </Box>
  );
}

export default ProjectDetailsMainPage;

import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Card, CardContent, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// layouts
// routes
// components
import Page from '../../components/Page';
// sections
import useLocales from 'hooks/useLocales';
// backgroundImage
import Logo from 'components/Logo';
import useAuth from 'hooks/useAuth';
import Image from './background.jpg';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  // padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  const { translate, currentLang } = useLocales();
  const { logout, activeRole } = useAuth();
  const navigate = useNavigate();

  const handleOnClickButton = () => {
    logout();
    navigate('/');
  };

  return (
    <Page title={translate('pages.landing.landing')}>
      <Box
        sx={{
          backgroundImage: `url(${Image})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 22%',
          backgroundSize: 'cover',
          position: 'relative',
          // zIndex: -1,
          padding: '25px',
          height: '100vh',
        }}
      >
        <Paper
          sx={{
            backgroundColor: '#fff',
            width: '120px',
            height: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <LogoOnlyLayout /> */}
          <Logo sx={{ width: '75px', height: '75px' }} />
        </Paper>
        <Container
          sx={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card sx={{ backgroundColor: '#fff', maxWidth: 850, padding: 9 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: 'text.primary', fontSize: '19.39px' }}>
                {/* عملائنا الأعزاء، لقد تم تحديث نظام المنح. يرجى استخدام الرابط التالي لاستخدام النظام
                الجديد. * في حال استخدامك للنظام الجديد لأول مرة يرجى إعادة ضبط كلمة المرور وسيتم
                إرسال رابط الاستعادة إلى بريدكم المسجل في النظام */}
                {/* {
                  ' شكراً لزيارتكم منصة ( غيث)، ونود إشعاركم بأن التقديم لطلب دعم المشاريع يكون من خلال منصة غيث بنسختها الجديدة على الرابط التالي علماً بأن الجهة تحتاج إلى استكمال بياناتها في المنصة ابتداءً. دمتم بخير'
                } */}
                ' شكراً لزيارتكم منصة ( غيث)، ونود إشعاركم بأن التقديم لطلب دعم المشاريع يكون من
                خلال منصة غيث بنسختها الجديدة على الرابط التالي علماً بأن الجهة تحتاج إلى استكمال
                بياناتها في المنصة ابتداءً. دمتم بخير'
              </Typography>
              <Button
                variant="contained"
                sx={{ margin: '20px 0', minHeight: '50px' }}
                onClick={handleOnClickButton}
              >
                انطلق إلى النظام الجديد
              </Button>
              <Typography sx={{ color: 'text.secondary', fontSize: '16px' }}>
                إذا كانت لديكم أي أسئلة أو استفسارات، يرجى التواصل معنا على البريد التالي:
              </Typography>
              <Typography
                sx={{ color: '#0E8478', fontSize: '16px', fontWeight: 'bold', paddingY: 1 }}
              >
                gaith_support@hcharity.org
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '16px',
                  direction: currentLang.value === 'ar' ? 'rtl' : 'ltr',
                }}
              >
                +966500640054
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Page>
  );
}

import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Grid, Stack } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets';
import { ReactComponent as UnplugIcon } from '../assets/un_plug_icon.svg';
//
import useLocales from 'hooks/useLocales';
import Space from '../components/space/space';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 1060,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const { translate } = useLocales();

  return (
    // <Page title="404 Page Not Found">
    <Page title={translate('pages.common.page_not_found')}>
      <ContentStyle>
        <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <m.div variants={varBounce().in}>
                {/* <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} /> */}
                <UnplugIcon style={{ height: '402.45px' }} />
              </m.div>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 10,
              }}
            >
              <Stack>
                <m.div variants={varBounce().in}>
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontWeight: 700,
                      fontSize: '96px',
                      textAlign: 'center',
                      color: 'primary.main',
                    }}
                  >
                    404
                  </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontWeight: 700,
                      fontSize: '40px',
                      textAlign: 'center',
                    }}
                  >
                    {translate('pages.common.error_page.not_found')}
                  </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontSize: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {translate('pages.common.error_page.not_found_detail')}
                  </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                  <Space direction="horizontal" size="small" />
                  <Button to="/" variant="contained" sx={{ width: '180px' }} component={RouterLink}>
                    {translate('button.back_to_homepage')}
                  </Button>
                </m.div>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </ContentStyle>
    </Page>
  );
}

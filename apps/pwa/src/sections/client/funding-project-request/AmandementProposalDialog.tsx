import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useResponsive from 'hooks/useResponsive';
import { Link as RouterLink, useParams } from 'react-router-dom';
import useLocales from '../../../hooks/useLocales';

function AmandementProposalDialog() {
  const isMobile = useResponsive('down', 'sm');
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const params = useParams();
  console.log('params', params);
  return (
    <Box
      sx={{
        width: '100%',
        height: isMobile ? '100%' : '130px',
        borderRadius: '30px',
        backgroundColor: '#FFC107',
        position: 'relative',
        mx: 2,
        my: 2,
      }}
    >
      <img
        src={'/icons/client-activate-icons/top-left.svg'}
        alt=""
        style={{
          width: '68.64px',
          height: '77.19px',
          position: 'absolute',
          left: '43.31px',
          top: '-40px',
        }}
      />

      <img
        src={'/icons/client-activate-icons/top-left-circul-1.svg'}
        style={{
          width: '22px',
          height: '22px',
          position: 'absolute',
          left: '85px',
          top: '32px',
        }}
        alt=""
      />
      <img
        src={'/icons/client-activate-icons/top-left-circul-2.svg'}
        style={{
          width: '8.32px',
          position: 'absolute',
          left: '72.04px',
          top: '65px',
        }}
        alt=""
      />
      <img
        src={'/icons/client-activate-icons/top-left-circul-3.svg'}
        style={{
          width: '5.55px',
          height: '5.55px',
          position: 'absolute',
          left: '25.22px',
          top: '30px',
        }}
        alt=""
      />
      <div
        style={{
          left: '0px',
          top: '52.8px',
          position: 'absolute',
          overflow: 'hidden',
          borderBottomLeftRadius: '30px',
        }}
      >
        <img
          src={'/icons/client-activate-icons/bottom-left.svg'}
          alt=""
          style={{ height: '77.19px' }}
        />
      </div>
      {isMobile ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            width: '100%',
          }}
        >
          <Stack>
            <Typography variant="h5" sx={{ alignSelf: 'center' }}>
              {translate('proposal_amandement.dialog.header')}
            </Typography>
            <Typography variant="h6" sx={{ alignSelf: 'center', px: 5 }}>
              {translate('proposal_amandement.dialog.body')}
              <Link
                variant="h6"
                component={RouterLink}
                to={'#'}
                sx={{ textDecorationLine: 'underline' }}
              >
                {translate('proposal_amandement.dialog.click_here')}
              </Link>
            </Typography>
          </Stack>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            width: '100%',
          }}
        >
          <Stack>
            <Typography variant="h5" sx={{ alignSelf: 'center' }}>
              {translate('proposal_amandement.dialog.header')}
            </Typography>
            <Typography variant="h6" sx={{ alignSelf: 'center', px: 5 }}>
              {translate('proposal_amandement.dialog.body')}
              <Link
                variant="h6"
                component={RouterLink}
                to={`/client/dashboard/amandement_projects/${params.id ?? 'vqSwfnk3UQ2DYYOMySC2_'}`}
                // to={'#'}
                sx={{ textDecorationLine: 'underline' }}
              >
                {translate('proposal_amandement.dialog.click_here')}
              </Link>
            </Typography>
          </Stack>
        </div>
      )}
    </Box>
  );
}

export default AmandementProposalDialog;

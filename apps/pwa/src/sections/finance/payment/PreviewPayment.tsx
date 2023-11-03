// react
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
// component
import { Grid, Button, styled, Container, Stack, useTheme, Box, Typography } from '@mui/material';
import Page from 'components/Page';
import Iconify from 'components/Iconify';
// section
import ProposalDetails from './ProposalDetails';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import ReactToPrint from 'react-to-print';
//
import { dispatch, useSelector } from 'redux/store';
import { getProposal, getTrackList } from 'redux/slices/proposal';
import dayjs from 'dayjs';

// -------------------------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

// -------------------------------------------------------------------------------------------------

export default function PreviewPayment() {
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const id = params?.id;

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getProposal(id as string, activeRole as string));
    dispatch(getTrackList(1, activeRole as string));
  }, [id, activeRole]);

  if (isLoading || proposal.id === '-1') return <>Loading ...</>;

  return (
    <Page title={translate('pages.project_details.details')}>
      <Container>
        <ContentStyle>
          <Stack
            component="div"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
            >
              <Iconify
                icon={
                  currentLang.value === 'en'
                    ? 'eva:arrow-ios-back-outline'
                    : 'eva:arrow-ios-forward-outline'
                }
                width={25}
                height={25}
              />
            </Button>

            <ReactToPrint
              trigger={() => (
                <Button variant="contained" color="primary" size="medium">
                  {translate('pages.finance.payment_generate.heading.print_out_data')}
                </Button>
              )}
              content={() => componentRef.current}
            />
          </Stack>
          <Box
            ref={componentRef}
            dir={currentLang.value === 'ar' ? 'rtl' : 'ltr'}
            sx={{
              backgroundColor: theme.palette.common.white,
              padding: theme.spacing(4),
              borderRadius: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              component="div"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                py: theme.spacing(1),
                px: theme.spacing(2),
              }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.then_exchange')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.the_date')}&nbsp;:{' '}
                <Typography variant="body1" component="span">
                  {proposal && proposal.payments
                    ? `${dayjs(proposal.payments[0].payment_date).format('YYYY-MM-DD')}`
                    : '-'}
                </Typography>
              </Typography>
            </Stack>
            {!proposal && isLoading ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  Loading ...
                </Grid>
              </Grid>
            ) : (
              <Grid container rowSpacing={2} columnSpacing={3} sx={{ mt: 1 }}>
                <ProposalDetails proposalData={proposal} loading={isLoading} />
              </Grid>
            )}
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

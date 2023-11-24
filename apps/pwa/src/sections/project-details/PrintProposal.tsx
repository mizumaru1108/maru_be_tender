// react
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
// component
import {
  Grid,
  Button,
  styled,
  Container,
  Stack,
  useTheme,
  Box,
  Typography,
  Link,
} from '@mui/material';
import Page from 'components/Page';
import Iconify from 'components/Iconify';
// section
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import ReactToPrint from 'react-to-print';
//
import { dispatch, useSelector } from 'redux/store';
import { getProposal, getTrackList } from 'redux/slices/proposal';
import { fCurrencyNumber } from 'utils/formatNumber';
import BankImageComp from 'sections/shared/BankImageComp';

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

export default function PrintProposal() {
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
              sx={{ padding: 1, minWidth: 35, minHeight: 25, mr: 3 }}
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
              padding: { xs: 2, sm: 3, md: 6 },
              borderRadius: 1,
            }}
          >
            <Grid
              container
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent={{ xs: 'normal', sm: 'space-between' }}
              alignItems="center"
            >
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    borderTop: `4px solid ${theme.palette.primary.main}`,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{ width: '100%', borderTop: `2px dashed ${theme.palette.primary.main}` }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ width: 100, height: 100 }}>
                  <img src="/favicon/tender-newlogo.png" alt="" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.main',
                    fontStyle: 'italic',
                    textAlign: { xs: 'center', sm: 'right' },
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    {translate('account_manager.partner_details.email')}&nbsp;:&nbsp;&nbsp;
                  </Typography>
                  <Typography component={Link} href={`mailto:gaith_support@hcharity.org`}>
                    gaith_support@hcharity.org
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.main',
                    fontStyle: 'italic',
                    textAlign: { xs: 'center', sm: 'right' },
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    {translate('account_manager.partner_details.phone')}&nbsp;:&nbsp;&nbsp;
                  </Typography>
                  <Typography component="span">0014969944</Typography>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    borderTop: `2px dashed ${theme.palette.primary.main}`,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    width: '100%',
                    borderTop: `4px solid ${theme.palette.primary.main}`,
                    mb: 3,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  {translate('pages.finance.payment_generate.heading.project_information')}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_name')}
                </Typography>
                <Typography fontWeight={700}>
                  {(proposal.project_name && proposal.project_name) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('amount_required_for_support')}
                </Typography>
                <Typography fontWeight={700}>
                  {(proposal.amount_required_fsupport &&
                    fCurrencyNumber(proposal.amount_required_fsupport)) ??
                    '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('pm_email')}
                </Typography>
                <Typography>{(proposal.pm_email && proposal.pm_email) ?? '-No Data-'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('pm_mobile')}
                </Typography>
                <Typography>{(proposal.pm_mobile && proposal.pm_mobile) ?? '-No Data-'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('governorate')}
                </Typography>
                <Typography>{(proposal && proposal.governorate) ?? '-No Data-'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('pages.finance.payment_generate.heading.project_region')}
                </Typography>
                <Typography>{(proposal.region && proposal.region) ?? '-No Data-'}</Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_implementation_date')}
                </Typography>
                <Typography>
                  {(proposal.project_implement_date &&
                    new Date(proposal.project_implement_date).toISOString().substring(0, 10)) ??
                    '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('where_to_implement_the_project')}
                </Typography>
                <Typography>
                  {(proposal.project_location && proposal.project_location) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('number_of_beneficiaries_of_the_project')}
                </Typography>
                <Typography>
                  {(proposal.num_ofproject_binicficiaries &&
                    proposal.num_ofproject_binicficiaries) ??
                    '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('target_group_type')}
                </Typography>
                <Typography>
                  {proposal.beneficiary_details?.name || proposal.project_beneficiaries}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('implementation_period')}
                </Typography>
                <Typography>
                  {(proposal.execution_time && proposal.execution_time) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_idea')}
                </Typography>
                <Typography sx={{ mb: '10px' }}>
                  {(proposal.project_idea && proposal.project_idea) ?? '-No Data'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_goals')}
                </Typography>
                <Typography sx={{ mb: '10px' }}>
                  {(proposal.project_goals && proposal.project_goals) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_outputs')}
                </Typography>
                <Typography sx={{ mb: '10px' }}>
                  {(proposal.project_outputs && proposal.project_outputs) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_strengths')}
                </Typography>
                <Typography sx={{ mb: '10px' }}>
                  {(proposal.project_strengths && proposal.project_strengths) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  sx={{
                    color: '#93A3B0',
                    fontSize: '12px',
                  }}
                >
                  {translate('project_risks')}
                </Typography>
                <Typography>
                  {(proposal.project_risks && proposal.project_risks) ?? '-No Data-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {(proposal.bank_information && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <BankImageComp
                      enableButton={true}
                      bankName={proposal.bank_information?.bank_name}
                      accountNumber={proposal.bank_information?.bank_account_number}
                      bankAccountName={proposal.bank_information?.bank_account_name}
                      imageUrl={proposal.bank_information?.card_image.url}
                      size={proposal.bank_information?.card_image.size}
                      type={proposal.bank_information?.card_image.type}
                      borderColor={
                        proposal.bank_information?.card_image.border_color ?? 'transparent'
                      }
                      isPrint={true}
                    />
                  </Grid>
                )) ?? (
                  <Typography sx={{ mb: '15px' }}>
                    {/* {(client_data && client_data.governorate && client_data.governorate) ?? '-No Data-'} */}
                    -No Bank Information-
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

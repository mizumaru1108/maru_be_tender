// react
import { useEffect, useState, useRef } from 'react';
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
import CardPayment from './CardPayment';
import ProposalDetails from './ProposalDetails';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { getOneProposal } from 'queries/commons/getOneProposal';
import ReactToPrint from 'react-to-print';
//
import { Proposal } from '../../../@types/proposal';
import { ReactComponent as Logo } from '../../../assets/new_logo.svg';

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
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  const [proposalData, setProposalData] = useState<Proposal | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const [{ data, fetching, error }] = useQuery({
    query: getOneProposal,
    variables: {
      id: params?.id,
    },
  });

  useEffect(() => {
    if (data) {
      setProposalData(data.proposal);
    }
  }, [data]);

  if (error) return <>Opss, something went wrong ...</>;

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
              p: 4,
              mt: 1,
              borderRadius: 1,
            }}
          >
            <Grid
              container
              rowSpacing={2}
              columnSpacing={3}
              justifyContent="space-between"
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
              <Grid item>
                <Logo width={100} height={100} />
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  sx={{ color: 'primary.main', fontStyle: 'italic', textAlign: 'right' }}
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
                  sx={{ color: 'primary.main', fontStyle: 'italic', textAlign: 'right' }}
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
                  }}
                />
              </Grid>
            </Grid>
            <Grid container rowSpacing={2} columnSpacing={3} sx={{ mt: 1 }}>
              <CardPayment proposalData={proposalData} />
            </Grid>
            <Grid container rowSpacing={2} columnSpacing={3} sx={{ mt: 1 }}>
              <ProposalDetails proposalData={proposalData} loading={fetching} />
            </Grid>
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

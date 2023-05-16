// react
import React from 'react';
import { useNavigate, useParams } from 'react-router';
// component
import { Grid, useTheme, Typography, Card } from '@mui/material';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { generateHeader } from 'utils/generateProposalNumber';
import { fCurrencyNumber } from 'utils/formatNumber';
//
import { Proposal } from '../../../@types/proposal';
import { useSelector } from 'redux/store';
import { getOneNameCashier } from 'queries/Cashier/getOneNameCashier';
import { formatCapitzlizeText } from 'utils/formatCapitzlizeText';

// -------------------------------------------------------------------------------------------------

interface IPropsData {
  proposalData: Proposal | null;
  loading: boolean;
}

// -------------------------------------------------------------------------------------------------

export default function ProposalDetails({ proposalData, loading }: IPropsData) {
  const { track_list } = useSelector((state) => state.proposal);
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  // const [{ data, fetching, error }] = useQuery({
  //   query: getOneNameCashier,
  //   variables: {
  //     id: proposalData?.cashier_id,
  //   },
  // });
  const trackName = track_list.find((track) => track.id === proposalData?.track_id)?.name ?? 'test';
  const paymentNumber =
    proposalData?.payments.find((payment) => payment.id === params.paymentId)?.order ?? -1; //it will return number of payments or -1 if it doesn't exist
  const paymentAmount =
    proposalData?.payments.find((payment) => payment.id === params.paymentId)?.payment_amount ?? -1; //it will return number of payments or -1 if it doesn't exist
  // console.log('cashierName', data.user_by_pk.employee_name);
  // console.log('role', activeRole);

  // if (fetching) return <>Loading...</>;
  // if (error) return <>Oops Something went wrong!</>;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom sx={{ mt: 1, color: theme.palette.primary.main }}>
          {translate('pages.finance.payment_generate.heading.project_information')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ p: 2.5, margin: '0 0 30px 0', backgroundColor: theme.palette.common.white }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_number')}&nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {(proposalData?.project_number && generateHeader(proposalData?.project_number)) ??
                  proposalData?.id}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_name')}&nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.project_name ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_track')}&nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {/* {translate(`${proposalData?.project_track}`) ?? '-'} */}
                {formatCapitzlizeText(trackName) ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_goals')}&nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.project_goals ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_region')}&nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.region ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_area')}&nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.project_location ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.payment_number')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {(paymentNumber !== -1 && paymentNumber) ?? 0}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.payment_amount')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {/* fCurrencyNumber(proposalData?.amount_required_fsupport ?? 0) */}
                {(paymentAmount !== -1 && fCurrencyNumber(paymentAmount)) ?? 0}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_total_support_amount')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {fCurrencyNumber(proposalData?.amount_required_fsupport ?? 0)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_outcome')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.project_outputs ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.iban_number')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.bank_information?.bank_account_number ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.bank_account_name')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.bank_information?.bank_account_name ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.bank_name')}
                &nbsp;:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {proposalData?.bank_information?.bank_name ?? '-'}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </React.Fragment>
  );
}

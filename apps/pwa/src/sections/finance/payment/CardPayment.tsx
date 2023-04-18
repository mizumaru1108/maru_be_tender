// react
import React from 'react';
import { useParams } from 'react-router';
// component
import { Grid, useTheme, Typography, Card } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { getInvoicePaymentData } from 'queries/commons/getOneProposal';
//
import { Proposal } from '../../../@types/proposal';
import { fCurrencyNumber } from 'utils/formatNumber';

// -------------------------------------------------------------------------------------------------

interface IPropsData {
  proposalData: Proposal;
  loading: boolean;
}

// -------------------------------------------------------------------------------------------------

function RenderingComponent({ proposalData }: { proposalData: Proposal }) {
  const { translate } = useLocales();
  const theme = useTheme();
  const params = useParams();

  const [{ data, fetching, error }] = useQuery({
    query: getInvoicePaymentData,
    variables: {
      proposal_id: params?.id,
      submitter_user_id: proposalData?.submitter_user_id,
      supervisor_id: proposalData?.supervisor_id,
      project_manager_id: proposalData?.project_manager_id,
      cashier_id: proposalData?.cashier_id,
      finance_id: proposalData?.finance_id,
      payment_id: params?.paymentId,
    },
  });

  if (fetching)
    return (
      <Grid item xs={12}>
        Loading ...
      </Grid>
    );

  if (error)
    return (
      <Grid item xs={12}>
        Opss, something went wrong ...
      </Grid>
    );

  return (
    <React.Fragment>
      {data && !fetching ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              {translate('pages.finance.payment_generate.heading.invoice_to')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2.5, backgroundColor: theme.palette.common.white }}>
              <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.client_name')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.client_name.employee_name ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.ceo_name')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.ceo_name[0].reviewer.employee_name ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.cashier_name')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.cashier_name.employee_name ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.supervisor_name')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.supervisor_name.employee_name ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.project_manager_name')}
                    &nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.project_manager_name.employee_name ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2.5, backgroundColor: theme.palette.common.white }}>
              <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.payment_description')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.payment_details.status
                      ? translate(
                          `pages.finance.payment_generate.heading.${data.payment_details.status}`
                        )
                      : '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.payment_total')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {fCurrencyNumber(Number(data.payment_details.payment_amount) ?? 0)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.transaction_number')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.payment_details.payment_number[0].number ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {translate('pages.finance.payment_generate.heading.date_of_payment')}&nbsp;:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {data.payment_details.payment_number.length
                      ? data.payment_details.payment_number[0].deposit_date
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </>
      ) : null}
    </React.Fragment>
  );
}

export default function CardPayment({ proposalData, loading }: IPropsData) {
  if (!proposalData && loading) {
    return (
      <Grid item xs={12}>
        Loading ...
      </Grid>
    );
  } else {
    return <RenderingComponent proposalData={proposalData} />;
  }
}

// react
import React from 'react';
import { useParams } from 'react-router';
// component
import { Grid, useTheme, Typography, Card, Divider } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { getInvoicePaymentData } from 'queries/commons/getOneProposal';
//
import { Proposal } from '../../../@types/proposal';
import { fCurrencyNumber } from 'utils/formatNumber';
import useAuth from 'hooks/useAuth';
import { generateHeader } from 'utils/generateProposalNumber';
import { getOrdinalIndicator } from 'utils/getOrdinalIndicator';

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
  const { activeRole } = useAuth();
  const receiptType = localStorage.getItem('receipt_type');

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

  const paymentNumber =
    proposalData?.payments.find((payment) => payment.id === params.paymentId)?.order ?? 'test';

  const Employee = React.useMemo(() => {
    let tmpEmployee = {
      ceo: 'no data',
      spv: 'no data',
      pm: 'no data',
      cashier: 'no data',
      finance: 'no data',
    };
    if (data) {
      if (data?.cashier_name?.employee_name) {
        tmpEmployee.cashier = data?.cashier_name?.employee_name;
      }
      if (data?.finance_name?.employee_name) {
        tmpEmployee.finance = data?.finance_name?.employee_name;
      }
      if (data?.project_manager_name?.employee_name) {
        tmpEmployee.pm = data?.project_manager_name?.employee_name;
      }
      if (data?.supervisor_name?.employee_name) {
        tmpEmployee.spv = data?.supervisor_name?.employee_name;
      }
      if (data?.finance_name?.employee_name) {
        tmpEmployee.ceo = data?.finance_name?.employee_name;
      }
      if (
        data?.ceo_name &&
        data?.ceo_name.length > 0 &&
        data?.ceo_name[0]?.reviewer &&
        data?.ceo_name[0]?.reviewer?.employee_name
      ) {
        tmpEmployee.ceo = data?.ceo_name[0]?.reviewer?.employee_name;
      }
    }
    return tmpEmployee;
  }, [data]);
  // console.log({ Employee, data });

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
  // console.log({ data });

  return (
    <React.Fragment>
      <>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
            {translate('pages.finance.payment_generate.heading.invoice_to')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 2.5, margin: '0 0 30px 0', backgroundColor: theme.palette.common.white }}>
            <Grid container rowSpacing={1} columnSpacing={2}>
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

              <Grid item xs={12} md={5}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {translate('pages.finance.payment_generate.heading.project_number')}&nbsp;:
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {(proposalData?.project_number && generateHeader(proposalData?.project_number)) ??
                    proposalData?.id}
                </Typography>
              </Grid>

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

              <Grid item xs={12}>
                <Grid container sx={{ textAlign: 'center', mt: 5 }}>
                  <Grid item xs={6}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {translate('pages.finance.payment_generate.heading.payment_description')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {translate('pages.finance.payment_generate.heading.payment_total')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider color="#000" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {`Payments for ${getOrdinalIndicator(Number(paymentNumber))} batch`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {fCurrencyNumber(Number(data.payment_details.payment_amount) ?? 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container justifyContent={'center'} sx={{ textAlign: 'center', mt: 10 }}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {`${Employee.cashier} (${translate('project_card.cashier')})`}
                    </Typography>
                    <Divider color="#000" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent={'center'} sx={{ textAlign: 'center', mt: 10 }}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {`${Employee.spv} (${translate('project_card.project_supervisor')})`}
                    </Typography>
                    <Divider color="#000" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent={'center'} sx={{ textAlign: 'center', mt: 10 }}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {`${Employee.spv} (${translate('project_card.project_manager')})`}
                    </Typography>
                    <Divider color="#000" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent={'center'} sx={{ textAlign: 'center', mt: 10 }}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {`${Employee.ceo} (${translate('project_card.ceo')})`}
                    </Typography>
                    <Divider color="#000" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </>
    </React.Fragment>
  );
}

export default function CardPaymentReceipt({ proposalData, loading }: IPropsData) {
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

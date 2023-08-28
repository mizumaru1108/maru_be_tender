// react
import React from 'react';
import { useNavigate, useParams } from 'react-router';
// component
import { Grid, useTheme, Typography, Card, Divider } from '@mui/material';
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
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { getFinanceName, getGeneratePaymentData } from 'queries/commons/getOneProposal';

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
  //   query: getFinanceName,
  //   variables: {
  //     id: proposalData?.finance_id,
  //   },
  // });

  const [{ data, fetching, error }] = useQuery({
    query: getGeneratePaymentData,
    variables: {
      proposal_id: params?.id,
      submitter_user_id: proposalData?.submitter_user_id,
      supervisor_id: proposalData?.supervisor_id,
      project_manager_id: proposalData?.project_manager_id,
      finance_id: proposalData?.finance_id,
      payment_id: params?.paymentId,
    },
  });

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

  // const financeName = data?.user_by_pk?.employee_name ?? 'test';

  // console.log({ Employee });

  if (fetching) return <>Loading...</>;
  if (error) return <>Oops Something went wrong!</>;

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
                {formatCapitalizeText(trackName) ?? '-'}
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

            <Grid item xs={12}>
              <Grid container justifyContent={'center'} sx={{ textAlign: 'center', mt: 10 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {`${Employee.finance} (${translate('project_card.finance')})`}
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
                    {`${Employee.pm} (${translate('project_card.project_manager')})`}
                  </Typography>
                  <Divider color="#000" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justifyContent={'center'} sx={{ textAlign: 'center', mt: 10 }}>
                <Grid item xs={12} md={4}>
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
    </React.Fragment>
  );
}

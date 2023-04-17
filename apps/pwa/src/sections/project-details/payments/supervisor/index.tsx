import { Box, Container, Grid, Typography } from '@mui/material';
import { getTheSpentBudgetForSpecificProposal } from 'queries/project-supervisor/getTheSpentBudgetForSpecificProposal';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'redux/store';
import { useQuery } from 'urql';
import PaymentsSetForm from './PaymentsSetForm';
import PaymentsTable from './PaymentsTable';
import useLocales from 'hooks/useLocales';
import { fCurrencyNumber } from 'utils/formatNumber';

function SupervisorPaymentsPage() {
  const { translate } = useLocales();
  const { id: proposal_id } = useParams();

  const { proposal, isLoading, error } = useSelector((state) => state.proposal);

  const [{ data: spentBudget, fetching }, refetch] = useQuery({
    query: getTheSpentBudgetForSpecificProposal,
    variables: { proposal_id },
  });

  React.useEffect(() => {}, [proposal]);

  if (fetching) return <>... Loading</>;

  return (
    <Grid container spacing={2} sx={{ mt: '3px' }}>
      <Grid item md={12}>
        {/* <Typography variant="h5">ميزانية المشروع</Typography> */}
        <Typography variant="h4">
          {translate('content.administrative.project_details.payment.heading.project_budget')}
        </Typography>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: '#fff',
            p: 2,
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            {translate(
              'content.administrative.project_details.payment.heading.registered_payments'
            )}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: 'text.tertiary',
              }}
            >
              {proposal.number_of_payments_by_supervisor ?? 0}&nbsp;
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: 'text.tertiary',
              }}
            >
              {translate('finance_pages.heading.batches')}
            </Typography>
          </Typography>
          {/* <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${proposal.number_of_payments_by_supervisor} دفعات`}</Typography> */}
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: '#fff',
            p: 2,
          }}
        >
          <img src={`/icons/rial-currency.svg`} alt="" />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', my: '5px' }}>
            {translate('content.administrative.project_details.payment.heading.total_budget')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            {fCurrencyNumber(proposal.fsupport_by_supervisor)}
          </Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: '#fff',
            p: 2,
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            {translate('content.administrative.project_details.payment.heading.amount_spent')}
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            {/* {fCurrencyNumber(
                proposal.payments.reduce((acc, curr) => acc + (curr.payment_amount || 0), 0)
              )} */}
            {fCurrencyNumber(spentBudget.payment_aggregate.aggregate.sum.payment_amount || 0)}
          </Typography>
        </Box>
      </Grid>
      <Grid item md={12}>
        <Typography variant="h4">
          {translate('content.administrative.project_details.payment.heading.split_payments')}
        </Typography>
      </Grid>
      {proposal.payments.length === 0 ? <PaymentsSetForm refetch={refetch} /> : <PaymentsTable />}
    </Grid>
  );
}

export default SupervisorPaymentsPage;

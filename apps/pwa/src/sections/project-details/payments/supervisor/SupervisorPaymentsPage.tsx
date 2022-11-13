import { Box, Grid, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import { getTheSpentBudgetForSpecificProposal } from 'queries/project-supervisor/getTheSpentBudgetForSpecificProposal';
import { insertPayments } from 'queries/project-supervisor/insertPayments';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useMutation, useQuery } from 'urql';
import ActionSetBox from './ActionSetBox';
import PaymentsSetForm from './PaymentsSetForm';
import PaymentsTable from './PaymentsTable';

// The main payment page of the supervisor
function SupervisorPaymentsPage({ data, mutate }: any) {
  console.log(data);
  const { id: proposal_id } = useParams();
  const defaultValues = {
    payments: [...Array(data.number_of_payments)].map((_, index) => ({
      payment_amount: undefined,
      payment_date: '',
    })),
  };

  const [result] = useQuery({
    query: getTheSpentBudgetForSpecificProposal,
    variables: { proposal_id },
  });
  const { data: spentBudget, fetching, error } = result;
  // insertPayments
  const [_, insertPay] = useMutation(insertPayments);

  const handleSetPayments = (data: any) => {
    const payments = data?.payments.map((item: any, index: any) => ({
      id: nanoid(),
      payment_amount: item.payment_amount,
      payment_date: item.payment_date,
      status: 'SET_BY_SUPERVISOR',
      proposal_id,
      order: index + 1,
    }));
    insertPay({
      payments,
      proposalId: proposal_id,
      approveProposalPayloads: {
        inner_status: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
        outter_status: 'PENDING',
        state: 'PROJECT_MANAGER',
      },
    }).then((result) => {
      if (result.error) {
        alert(`Oh no! ${result.error}`);
        mutate();
      }
      if (!result.error) {
        alert('The payments has been set');
        mutate();
      }
    });
  };
  if (fetching) return <>... Loading</>;
  return (
    <Grid container spacing={3} sx={{ mt: '8px' }}>
      <Grid item md={12}>
        <Typography variant="h4">ميزانية المشروع</Typography>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            عدد الدفعات المسجلة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.number_of_payments} دفعات`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <img src={`/icons/rial-currency.svg`} alt="" />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            الميزانية الكلية للمشروع
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.amount_required_fsupport} ريال`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            المبلغ المصروف
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${spentBudget.payment_aggregate.aggregate.spent_budget} ريال`}</Typography>
        </Box>{' '}
      </Grid>
      <Grid item md={12}>
        <Typography variant="h4">تقسيم الدفعات</Typography>
      </Grid>
      {data.payments.length === 0 && (
        <PaymentsSetForm defaultValues={defaultValues} onSubmit={handleSetPayments}>
          <ActionSetBox />
        </PaymentsSetForm>
      )}
      {data.payments.length !== 0 && (
        <PaymentsTable payments={data.payments}>
          {data.inner_status !== 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' && <ActionSetBox />}
        </PaymentsTable>
      )}
    </Grid>
  );
}

export default SupervisorPaymentsPage;

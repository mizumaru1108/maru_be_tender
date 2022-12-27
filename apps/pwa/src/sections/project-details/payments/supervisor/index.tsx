import { Box, Container, Grid, Typography } from '@mui/material';
import { getTheSpentBudgetForSpecificProposal } from 'queries/project-supervisor/getTheSpentBudgetForSpecificProposal';
import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'redux/store';
import { useQuery } from 'urql';
import PaymentsSetForm from './PaymentsSetForm';
import PaymentsTable from './PaymentsTable';

function SupervisorPaymentsPage() {
  const { id: proposal_id } = useParams();

  const { proposal } = useSelector((state) => state.proposal);

  console.log(proposal);
  const [{ data: spentBudget, fetching }] = useQuery({
    query: getTheSpentBudgetForSpecificProposal,
    variables: { proposal_id },
  });

  React.useEffect(() => {}, [proposal.payments]);

  if (fetching) return <>... Loading</>;
  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: '3px' }}>
        <Grid item md={12}>
          <Typography variant="h5">ميزانية المشروع</Typography>
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
            >{`${proposal.number_of_payments_by_supervisor} دفعات`}</Typography>
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
            >{`${proposal.amount_required_fsupport} ريال`}</Typography>
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
          </Box>
        </Grid>
        <Grid item md={12}>
          <Typography variant="h4">تقسيم الدفعات</Typography>
        </Grid>
        {proposal.payments.length === 0 ? <PaymentsSetForm /> : <PaymentsTable />}
      </Grid>
    </Container>
  );
}

export default SupervisorPaymentsPage;

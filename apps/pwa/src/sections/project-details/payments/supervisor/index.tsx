import { Box, Container, Grid, Typography } from '@mui/material';
import { getTheSpentBudgetForSpecificProposal } from 'queries/project-supervisor/getTheSpentBudgetForSpecificProposal';
import React from 'react';
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

  const { proposal } = useSelector((state) => state.proposal);

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
            <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
              {fCurrencyNumber(proposal.amount_required_fsupport)}
            </Typography>
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
            <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
              {/* {fCurrencyNumber(
                proposal.payments.reduce((acc, curr) => acc + (curr.payment_amount || 0), 0)
              )} */}
              {fCurrencyNumber(proposal.fsupport_by_supervisor)}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Typography variant="h4">
            {translate('content.administrative.project_details.payment.heading.split_payments')}
          </Typography>
        </Grid>
        {proposal.payments.length === 0 ? <PaymentsSetForm /> : <PaymentsTable />}
      </Grid>
    </Container>
  );
}

export default SupervisorPaymentsPage;

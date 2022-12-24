import { Box, Grid, Typography } from '@mui/material';
import { Proposal } from '../../../../@types/proposal';
import { useSelector } from 'redux/store';
import PaymentsTable from './PaymentsTable';

function FinancePaymentsPage() {
  const { proposal } = useSelector((state) => state.proposal);

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
          <img src={`/icons/rial-currency.svg`} alt="" />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            الميزانية الكلية للمشروع
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>{`${
            (proposal as Proposal).amount_required_fsupport
          } ريال`}</Typography>
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
            عدد الدفعات المسجلة
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>{`${
            (proposal as Proposal).number_of_payments
          } دفعات`}</Typography>
        </Box>
      </Grid>

      <Grid item md={12}>
        <Typography variant="h4">تقسيم الدفعات</Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        <PaymentsTable />
      </Grid>
    </Grid>
  );
}

export default FinancePaymentsPage;

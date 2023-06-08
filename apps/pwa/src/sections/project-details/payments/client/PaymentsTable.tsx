import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { updatePayment } from 'queries/project-supervisor/updatePayment';
import { useEffect, useState } from 'react';
import { useMutation } from 'urql';
import useLocales from '../../../../hooks/useLocales';

// The general page after the payments are set
/**
 * payments = [
 *  {
 *    payment_date: string
      payment_amount: number
      id: nanoid
      status: set_by_supervisor | issued_by_supervisor | accepted_by_project_manager | accepted_by_finance | done
 *  }
 * ]
 */
const PaymentsNames = [
  'الدفعة الأولى',
  'الدفعة الثانية',
  'الدفعة الثالثة',
  'الدفعة الرابعة',
  'الدفعة الخامسة',
  'الدفعة السادسة',
  'الدفعة السابعة',
];
type PaymentProps = {
  payment_date: string;
  payment_amount: number;
  id: string;
  status:
    | 'set_by_supervisor'
    | 'issued_by_supervisor'
    | 'accepted_by_project_manager'
    | 'accepted_by_finance'
    | 'done';
};

function PaymentsTable({ payments, children }: { payments: PaymentProps[]; children?: any }) {
  const { translate } = useLocales();
  const [currentIssuedPayament, setCurrentIssuedPayament] = useState(0);
  const [beenIssued, setBeenIssued] = useState(false);
  const [_, updatePay] = useMutation(updatePayment);
  const handleIssuePayment = (data: PaymentProps) => {
    const payload = { id: data.id, newState: { status: 'issued_by_supervisor' } };
    updatePay(payload).then((result) => {
      if (!result.error) {
        alert('The payment has been issued');
        setBeenIssued(true);
      }
      if (result.error) {
        alert(`oobs there is an error occured ${result.error}`);
      }
    });
  };
  useEffect(() => {
    console.log(payments);
    for (var i = 0; i < payments.length; i++) {
      if (payments[i].status === 'set_by_supervisor') {
        console.log(i);
        setCurrentIssuedPayament(i);
        break;
      }
    }
  }, [beenIssued, payments]);
  return (
    <>
      {payments.map((item: any, index: any) => (
        <Grid item md={12} key={index} sx={{ mb: '20px' }}>
          <Grid container direction="row" key={index}>
            <Grid item md={2}>
              <Typography variant="h6">{PaymentsNames[index]}</Typography>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>مبلغ الدفعة:</Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {item.payment_amount}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>تاريخ الدفعة:</Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {item.payment_date}
                </Typography>
              </Stack>
            </Grid>
            {item.status === 'done' ? (
              <>
                <Grid item md={6} sx={{ textAlign: '-webkit-center' }}>
                  <Button
                    component={Link}
                    href={item.cheques[0].transfer_receipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="صورة بطاقة الحساب البنكي"
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#000',
                      textDecorationLine: 'underline',
                    }}
                  >
                    استعراض ايصال التحويل
                  </Button>
                </Grid>
                <Grid item md={2} sx={{ textAlign: '-webkit-center' }}>
                  <Button
                    variant="text"
                    color="inherit"
                    sx={{
                      '&:hover': { textDecorationLine: 'underline' },
                    }}
                    href={item.cheques[0].transfer_receipt.url ?? '#'}
                    target="_blank"
                  >
                    {translate(
                      'content.administrative.project_details.payment.table.btn.view_transfer_receipt'
                    )}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item md={6}>
                <Box>{''}</Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
      {children}
    </>
  );
}

export default PaymentsTable;

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { updatePayment } from 'queries/project-supervisor/updatePayment';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'urql';

// The general page after the payments are set
/**
 * payments = [
 *  {
 *    payment_date: string
      payment_amount: number
      id: nanoid
      status: SET_BY_SUPERVISOR | ISSUED_BY_SUPERVISOR | ACCEPTED_BY_PROJECT_MANAGER | ACCEPTED_BY_FINANCE | DONE
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
    | 'SET_BY_SUPERVISOR'
    | 'ISSUED_BY_SUPERVISOR'
    | 'ACCEPTED_BY_PROJECT_MANAGER'
    | 'ACCEPTED_BY_FINANCE'
    | 'DONE';
};
function PaymentsTable({ payments, children }: { payments: PaymentProps[]; children: any }) {
  const [currentIssuedPayament, setCurrentIssuedPayament] = useState(0);
  const [beenIssued, setBeenIssued] = useState(false);
  const [_, updatePay] = useMutation(updatePayment);
  const handleIssuePayment = (data: PaymentProps) => {
    const payload = { id: data.id, newState: { status: 'ISSUED_BY_SUPERVISOR' } };
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
    for (var i = 0; i < payments.length; i++) {
      if (payments[i].status === 'SET_BY_SUPERVISOR') {
        setCurrentIssuedPayament(i);
        break;
      }
    }
  }, [beenIssued, payments]);
  console.log(currentIssuedPayament);
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
            {item.status !== 'SET_BY_SUPERVISOR' ? (
              <Grid item md={3}>
                <Typography variant="h6" sx={{ color: '#0E8478' }}>
                  تم اصدار إذن الصرف بنجاح
                </Typography>
              </Grid>
            ) : (
              <Grid item md={3}>
                <Button
                  sx={{
                    color: index !== currentIssuedPayament ? '#fff' : '#1E1E1E',
                    backgroundColor: index === currentIssuedPayament ? '#0E8478' : '#93A3B03D',
                    borderRadius: 1,
                    width: '200px',
                  }}
                  disabled={index !== currentIssuedPayament ? true : false}
                  onClick={() => {
                    handleIssuePayment(item);
                  }}
                >
                  إصدار إذن صرف
                </Button>
              </Grid>
            )}
            {item.status === 'DONE' ? (
              <Grid item md={2}>
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    textDecorationLine: 'underline',
                  }}
                  onClick={() => {
                    console.log('asdasd');
                  }}
                >
                  استعراض ايصال التحويل
                </Button>
              </Grid>
            ) : (
              <Grid item md={2}>
                <Box>{''}</Box>
              </Grid>
            )}
            <Grid item md={1} sx={{ textAlignLast: 'end' }}>
              <Button
                sx={{
                  backgroundColor: '#0169DE',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1436_33298)">
                    <path
                      d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47319 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1436_33298">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ))}
      {children}
    </>
  );
}

export default PaymentsTable;
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
function PaymentsTable({ payments, children }: { payments: PaymentProps[]; children?: any }) {
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
              <Grid item md={3} sx={{ textAlign: '-webkit-center', pt: '14px' }}>
                <Typography
                  sx={{
                    color: '#0E8478',
                  }}
                >
                  تم اصدار إذن الصرف بنجاح
                </Typography>
              </Grid>
            ) : (
              <Grid item md={3}>
                <Box>{''}</Box>
              </Grid>
            )}
            {item.status === 'DONE' ? (
              <Grid item md={3} sx={{ textAlign: '-webkit-center' }}>
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    textDecorationLine: 'underline',
                    height: '100%',
                    ':hover': { backgroundColor: '#b8b7b4', textDecorationLine: 'underline' },
                    width: '100%',
                  }}
                  onClick={() => {
                    console.log('asdasd');
                  }}
                >
                  استعراض ايصال التحويل
                </Button>
              </Grid>
            ) : (
              <Grid item md={3}>
                <Box>{''}</Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default PaymentsTable;

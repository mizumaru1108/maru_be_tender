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
function PaymentsTable({
  payments,
  setModalOpen,
}: {
  payments: PaymentProps[];
  setModalOpen: any;
}) {
  return (
    <>
      {payments.map((item: any, index: any) => (
        <Grid item md={12} key={index} sx={{ mb: '20px' }}>
          <Grid container direction="row" key={index}>
            <Grid item md={2} sx={{ alignSelf: 'center' }}>
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
            {item.status === 'ACCEPTED_BY_FINANCE' ? (
              <Grid item md={3} sx={{ textAlign: '-webkit-center' }}>
                <Button
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    textDecorationLine: 'underline',
                    height: '100%',
                    ':hover': { backgroundColor: '#b8b7b4', textDecorationLine: 'underline' },
                    width: '100%',
                    border: `1px solid #000`,
                    borderStyle: 'dashed',
                  }}
                  endIcon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12.0002V21.0002M12 12.0002L9.49996 14.0002M12 12.0002L14.5 14.0002M5.03396 9.11719C4.08817 9.35518 3.26184 9.93035 2.71021 10.7346C2.15859 11.5389 1.91964 12.5169 2.03827 13.485C2.15689 14.453 2.62492 15.3444 3.35443 15.9917C4.08393 16.639 5.02469 16.9976 5.99996 17.0002H6.99996"
                        stroke="#1E1E1E"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.8299 7.13772C15.4881 5.78429 14.6445 4.61146 13.47 3.85698C12.2956 3.10249 10.8782 2.82281 9.50517 3.07462C8.13215 3.32643 6.90625 4.0909 6.07598 5.21306C5.2457 6.33521 4.87318 7.73109 5.03392 9.11772C5.03392 9.11772 5.18692 9.99972 5.49992 10.4997"
                        stroke="#1E1E1E"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 17C17.706 16.9995 18.404 16.8495 19.0479 16.5599C19.6917 16.2702 20.267 15.8475 20.7357 15.3195C21.2045 14.7915 21.5561 14.1702 21.7674 13.4965C21.9787 12.8229 22.045 12.1121 21.9618 11.4109C21.8786 10.7098 21.6479 10.0343 21.2848 9.42874C20.9217 8.82321 20.4345 8.30145 19.8552 7.89778C19.276 7.49412 18.6178 7.21772 17.924 7.08676C17.2302 6.9558 16.5166 6.97327 15.83 7.138L14.5 7.5"
                        stroke="#1E1E1E"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                  onClick={() => setModalOpen(item)}
                >
                  رفع ايصال التحويل
                </Button>
              </Grid>
            ) : item.status === 'DONE' ? (
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
                    console.log('upload');
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

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { CachierPaymentsTable } from './payments/cachier';
import { FinancePaymentsTable } from './payments/finance';
import { ProjectManagerPaymentsTable } from './payments/project-manager';
import { SupervisorPaymentsPage } from './payments/supervisor';
// const payments = [
//   {
//     payment_name: 'الدفعة الأولى',
//     anount: '10.000 ريال',
//     date: '30-8-2022',
//     status: 'completed',
//   },
//   {
//     payment_name: 'الدفعة الثانية',
//     anount: '10.000 ريال',
//     date: '30-9-2022',
//     status: 'completed',
//   },
//   {
//     payment_name: 'الدفعة الثالثة',
//     anount: '10.000 ريال',
//     date: '30-10-2022',
//     status: 'pending',
//   },
//   {
//     payment_name: 'الدفعة الرابعة',
//     anount: '10.000 ريال',
//     date: '30-11-2022',
//     status: 'pending',
//   },
//   {
//     payment_name: 'الدفعة الخامسة',
//     anount: '10.000 ريال',
//     date: '30-12-2022',
//     status: 'pending',
//   },
// ];
function Payments({ role }: any) {
  /**
   * 1- check the proposal status
   * 2- if(proposal status === ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION && the role === project_supervisor ) =>
   *    1- show the supervisor page to set all the payments.
   *    2- after the payments are set show the supervisor next page with
   *        2.1- the budget
   *        2.2- the ability to edit a payment
   *        2.3- seeing the chique
   *        2.4- issueing the payment's permission
   * 3- if(proposal status === "" and the role === project_manager)
   *    1- accept the permission
   *    2- reject the permission
   * 4- if(proposal status === "" and the role === finance)
   *    1- without any action
   *    2-showing the cheque button
   *
   * 5- if(proposal status === "" and the role === cachier)
   *    1- upload the cheque popup
   *
   *
   */

  // if the inner_status !== ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION
  // return <>The Payments haven't been set yet</>
  return (
    <div>
      {/*  inside everything is gonna be controlled */}
      {role === 'tender_supervisor' && <SupervisorPaymentsPage />}
      {/* proposal.payments !== null
          and inside we will look at everysingle payment's status.
      */}
      {role === 'tender_project_manager' && <ProjectManagerPaymentsTable />}
      {/* proposal.payments !== null
          and inside we will look at everysingle payment's status.
      */}
      {role === 'tender_finance' && <FinancePaymentsTable />}
      {/* proposal.payments !== null
          and inside we will look at everysingle payment's status.
      */}
      {role === 'tender_cashier' && <CachierPaymentsTable />}
    </div>
    // <Grid container spacing={3} sx={{ mt: '8px' }}>
    //   <Grid item md={12}>
    //     <Typography variant="h4">ميزانية المشروع</Typography>
    //   </Grid>
    //   <Grid item md={2} xs={12}>
    //     <Box
    //       sx={{
    //         borderRadius: '8px',
    //         backgroundColor: '#fff',
    //         py: '30px',
    //         paddingRight: '40px',
    //         paddingLeft: '5px',
    //         height: '120px',
    //       }}
    //     >
    //       <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
    //         عدد الدفعات المسجلة
    //       </Typography>
    //       <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>5 دفعات</Typography>
    //     </Box>
    //   </Grid>
    //   <Grid item md={2} xs={12}>
    //     <Box
    //       sx={{
    //         borderRadius: '8px',
    //         backgroundColor: '#fff',
    //         py: '30px',
    //         paddingRight: '40px',
    //         paddingLeft: '5px',
    //         height: '120px',
    //       }}
    //     >
    //       <img src={`/icons/rial-currency.svg`} alt="" />
    //       <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
    //         الميزانية الكلية للمشروع
    //       </Typography>
    //       <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>500 ريال</Typography>
    //     </Box>
    //   </Grid>
    //   <Grid item md={2} xs={12}>
    //     <Box
    //       sx={{
    //         borderRadius: '8px',
    //         backgroundColor: '#fff',
    //         py: '30px',
    //         paddingRight: '40px',
    //         paddingLeft: '5px',
    //         height: '120px',
    //       }}
    //     >
    //       <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
    //         المبلغ المصروف
    //       </Typography>
    //       <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>20.000 ريال</Typography>
    //     </Box>{' '}
    //   </Grid>
    //   <Grid item md={12}>
    //     <Typography variant="h4">تقسيم الدفعات</Typography>
    //   </Grid>
    //   {payments.map((item, index) => (
    //     <Grid item md={12} key={index}>
    //       <Grid container direction="row" key={index}>
    //         <Grid item md={2}>
    //           <Typography variant="h6">{item.payment_name}</Typography>
    //         </Grid>
    //         <Grid item md={2}>
    //           <Stack direction="column">
    //             <Typography sx={{ color: '#93A3B0' }}>تاريخ الدفعة:</Typography>
    //             <Typography sx={{ color: '#1E1E1E' }} variant="h6">
    //               {item.anount}
    //             </Typography>
    //           </Stack>
    //         </Grid>
    //         <Grid item md={2}>
    //           <Stack direction="column">
    //             <Typography sx={{ color: '#93A3B0' }}>تاريخ الدفعة:</Typography>
    //             <Typography sx={{ color: '#1E1E1E' }} variant="h6">
    //               {item.anount}
    //             </Typography>
    //           </Stack>
    //         </Grid>
    //         {item.status === 'completed' && (
    //           <>
    //             <Grid item md={3}>
    //               <Typography sx={{ color: '#0E8478' }}>تم اصدار إذن الصرف</Typography>
    //             </Grid>
    //             <Grid item md={3}>
    //               <Button
    //                 variant="outlined"
    //                 sx={{
    //                   color: '#93A3B0',
    //                   width: { xs: '100%', sm: '200px' },
    //                   hieght: '100px',
    //                   borderColor: '#93A3B0',
    //                   textDecorationLine: 'underline',
    //                 }}
    //               >
    //                 استعراض ايصال التحويل
    //               </Button>
    //             </Grid>
    //           </>
    //         )}
    //       </Grid>
    //     </Grid>
    //   ))}
    // </Grid>
  );
}

export default Payments;

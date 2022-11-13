import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { FusionAuthRoles } from '../../@types/commons';
import { CachierPaymentsTable } from './payments/cachier';
import { FinancePaymentsTable } from './payments/finance';
import { ManagerPaymentsPage } from './payments/project-manager';
import { SupervisorPaymentsPage } from './payments/supervisor';

function Payments({ data, mutate }: any) {
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as FusionAuthRoles;
  /**
   * 1- check the proposal status
   * 2- if(proposal status === ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION && the role === project_supervisor ) =>
   *    1- show the supervisor page to set all the payments.
   *    2- after the payments are set show the supervisor next page with
   *        2.1- the budget
   *        2.2- the ability to edit a payment
   *        2.3- seeing the chique
   *        2.4- issueing the payment's permission
   * 3- if(proposal status === "ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION" and the role === project_manager)
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
  if (
    [
      'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
      'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
    ].includes(data.inner_status) &&
    role === 'tender_project_supervisor'
  )
    return <SupervisorPaymentsPage data={data} mutate={mutate} />;
  if (data.inner_status === 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR') {
    return (
      <div>
        {role === 'tender_project_manager' && <ManagerPaymentsPage data={data} mutate={mutate} />}
        {role === 'tender_finance' && <FinancePaymentsTable data={data} mutate={mutate} />}
        {role === 'tender_cashier' && <CachierPaymentsTable data={data} mutate={mutate} />}
      </div>
    );
  }
  return <>The Payments haven't been set yet</>;
}

export default Payments;

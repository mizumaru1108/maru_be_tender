import useAuth from 'hooks/useAuth';
import { CachierPaymentsTable } from './payments/cachier';
import { FinancePaymentsTable } from './payments/finance';
import { ManagerPaymentsPage } from './payments/project-manager';
import { SupervisorPaymentsPage } from './payments/supervisor';

function Payments({ data, mutate }: any) {
  const { activeRole } = useAuth();
  const role = activeRole!;
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
        {role === 'tender_client' && <CachierPaymentsTable data={data} mutate={mutate} />}
      </div>
    );
  }
  return <>The Payments haven't been set yet</>;
}

export default Payments;

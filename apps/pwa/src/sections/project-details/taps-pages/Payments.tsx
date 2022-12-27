import useAuth from 'hooks/useAuth';
import { useSelector } from 'redux/store';
import { CachierPaymentsTable } from '../payments/cachier';
import FinancePaymentsPage from '../payments/finance';
import { ManagerPaymentsPage } from '../payments/project-manager';
import SupervisorPaymentsPage from '../payments/supervisor';

function Payments() {
  const { activeRole } = useAuth();

  const { proposal } = useSelector((state) => state.proposal);

  if (
    [
      'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
      'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
    ].includes(proposal.inner_status) &&
    activeRole === 'tender_project_supervisor'!
  )
    return <SupervisorPaymentsPage />;
  if (proposal.inner_status === 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR') {
    return (
      <div>
        {activeRole === 'tender_project_manager' && <ManagerPaymentsPage />}
        {activeRole === 'tender_finance' && <FinancePaymentsPage />}
        {activeRole === 'tender_cashier' && <CachierPaymentsTable />}
        {activeRole === 'tender_client' && <CachierPaymentsTable />}
      </div>
    );
  }
  return <>The Payments haven't been set yet</>;
}

export default Payments;
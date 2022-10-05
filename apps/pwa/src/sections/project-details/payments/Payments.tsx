import React from 'react';
import { CachierPaymentsTable } from './cachier';
import { FinancePaymentsTable } from './finance';
// import { ProjectManagerPaymentsTable } from './project-manager';
import { SupervisorPaymentsPage } from './supervisor';

function Payments({ proposal }: { proposal: any }) {
  console.log(proposal);
  // if the proposal status is ACCEPTED_BY
  return (
    <div>
      {/*  inside everything is gonna be controlled */}
      <SupervisorPaymentsPage />
      {/* proposal.payments !== null
          and inside we will look at everysingle payment's status.
      */}
      {/* <ProjectManagerPaymentsTable /> */}
      {/* proposal.payments !== null
          and inside we will look at everysingle payment's status.
      */}
      {/* <FinancePaymentsTable /> */}
      {/* proposal.payments !== null
          and inside we will look at everysingle payment's status.
      */}
      {/* <CachierPaymentsTable /> */}
    </div>
  );
}

export default Payments;

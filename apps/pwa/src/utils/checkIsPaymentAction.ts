export const IsPaymentAction = (payload: string): boolean => {
  const paymentAction = [
    'set_by_supervisor',
    'issued_by_supervisor',
    'accepted_by_project_manager',
    'accepted_by_finance',
    'uploaded_by_cashier',
    'reject_cheque',
    'done',
  ];
  const result = paymentAction.includes(payload) ? true : false;
  return result;
};

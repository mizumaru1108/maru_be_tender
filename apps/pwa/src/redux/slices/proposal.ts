import { createSlice } from '@reduxjs/toolkit';
import { getOneProposal } from 'queries/commons/getOneProposal';
import { insertPayments } from 'queries/project-supervisor/insertPayments';
import { dispatch } from 'redux/store';
import graphQlAxiosInstance from 'utils/axisoGraphQlInstance';
import { ActiveTap, Proposal } from '../../@types/proposal';
import { updatePayment } from 'queries/project-supervisor/updatePayment';
import { insertChequeUpdatePayment } from 'queries/Cashier/insertChequeUpdatePayment';
import { createNewFollowUp } from 'queries/commons/createNewFollowUp';
import axiosInstance from 'utils/axios';

// ----------------------------------------------------------------------

interface ProposalItme {
  isLoading: boolean;
  error: Error | string | null;
  activeTap: ActiveTap;
  checkedItems: any;
  proposal: Proposal;
}

const initialState: ProposalItme = {
  isLoading: false,
  error: null,
  activeTap: 'main',
  checkedItems: [],
  proposal: {
    id: '-1',
    project_name: 'test',
    project_implement_date: new Date('10-10-2022'),
    project_location: 'test',
    project_track: 'test',
    user: {
      id: 'test',
      employee_name: 'test',
      email: 'test',
      mobile_number: 'test',
      roles: [],
      client_data: {
        region: 'test',
        governorate: 'test',
        date_of_esthablistmen: new Date('10-10-2022'),
        num_of_beneficiaries: 0,
      },
      bank_informations: [
        {
          id: 'test',
          bank_account_name: 'test',
          bank_account_number: 0,
          bank_name: 'test',
          card_image: { url: 'test', size: undefined, type: 'test' },
        },
      ],
    },
    added_value: '',
    been_made_before: false,
    been_supported_before: false,
    chairman_of_board_of_directors: '',
    clause: '',
    most_clents_projects: '',
    reasons_to_accept: '',
    recommended_supports: [
      {
        amount: 0,
        explanation: 'test',
        clause: 'test',
        id: 'test',
      },
    ],
    remote_or_insite: false,
    target_group_age: 0,
    target_group_num: 0,
    target_group_type: '',
    created_at: new Date('10-10-2022'),
    num_ofproject_binicficiaries: 0,
    region: 'test',
    execution_time: '3 أشهر',
    project_idea: 'test',
    project_goals: 'test',
    project_outputs: 'test',
    project_strengths: 'test',
    project_risks: 'test',
    bank_informations: [
      {
        id: 'test',
        bank_account_name: 'test',
        bank_account_number: 0,
        bank_name: 'test',
        card_image: { url: 'test', size: undefined, type: 'test' },
      },
    ],
    amount_required_fsupport: 0,
    letter_ofsupport_req: { url: 'test', size: undefined, type: 'test' },
    project_attachments: { url: 'test', size: undefined, type: 'test' },
    project_beneficiaries: 'test',
    inner_status: 'CREATED_BY_CLIENT',
    outter_status: 'ONGOING',
    state: 'test',
    payments: [
      {
        id: 'test',
        payment_amount: 0,
        payment_date: new Date('10-10-2022'),
        status: 'SET_BY_SUPERVISOR',
        order: 0,
        cheques: [
          {
            id: 'test',
            number: 0,
            payment_id: 0,
            transfer_receipt: 'test',
            deposit_date: new Date('10-10-2022'),
          },
        ],
      },
    ],
    number_of_payments: 0,
    number_of_payments_by_supervisor: 0,
    support_type: false,
    proposal_item_budgets: [
      {
        amount: 0,
        explanation: 'test',
        clause: 'test',
        id: 'test',
      },
    ],
    proposal_item_budgets_aggregate: {
      aggregate: {
        sum: {
          amount: 0,
        },
      },
    },
    follow_ups: [],
  },
};

const slice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // END LOADING
    endLoading(state) {
      state.isLoading = false;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // SET PROPOSAL
    setProposal(state, action) {
      state.proposal = action.payload;
    },
    // SET ACTIVE TAP
    setActiveTap(state, action) {
      state.activeTap = action.payload;
    },
    // SET CHECKED ITEMS FOLLOW UP
    setCheckedItems(state, action) {
      state.checkedItems = action.payload;
    },
    // SET PAYMENTS
    setPayments(state, action) {
      state.proposal.payments = action.payload.payments;
      state.proposal = { ...state.proposal, ...action.payload.updatedData };
    },
    // EDIT PAYMENT
    editPayment(state, action) {
      const { status, payment_id } = action.payload;
      const payment_index = state.proposal.payments.findIndex(
        (payment) => payment.id === payment_id
      );
      state.proposal.payments[payment_index].status = status;
    },
    // INSERT CHEQUE
    insertCheque(state, action) {
      const { payment_id, cheque } = action.payload;
      const payment_index = state.proposal.payments.findIndex(
        (payment) => payment.id === payment_id
      );
      state.proposal.payments[payment_index].cheques.push(cheque);
      state.proposal.payments[payment_index].status = 'DONE';
    },
    // INSERT FOLLOWUPS
    insertFollowUp(stat, action) {
      stat.proposal.follow_ups.push(action.payload.follow_up);
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setProposal, setActiveTap, setCheckedItems } = slice.actions;

export const getProposal = (id: string) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    const res = await graphQlAxiosInstance.post('', { query: getOneProposal, variables: { id } });

    dispatch(slice.actions.setProposal(res.data.data.proposal));
    dispatch(slice.actions.endLoading);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const insertPaymentsBySupervisor = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    const res = await graphQlAxiosInstance.post('', {
      query: insertPayments,
      variables: {
        payments: data.payments,
        proposalId: data.id,
        approveProposalPayloads: {
          inner_status: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
          outter_status: 'ONGOING',
          state: 'PROJECT_MANAGER',
        },
      },
    });
    dispatch(slice.actions.endLoading);
    console.log(res);
    dispatch(
      slice.actions.setPayments({
        payments: data.payments,
        updatedData: res.data.data.update_proposal.returning[0],
      })
    );
  } catch (error) {
    dispatch(slice.actions.endLoading);
    throw error;
  }
};

export const updatePaymentBySupervisorAndManagerAndFinance = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    const res = await graphQlAxiosInstance.post('', {
      query: updatePayment,
      variables: {
        id: data.id,
        newState: { status: data.status },
      },
    });
    dispatch(slice.actions.endLoading);
    dispatch(
      slice.actions.editPayment({
        payment_id: data.id,
        status: res.data.data.update_payment_by_pk.status,
      })
    );
  } catch (error) {
    dispatch(slice.actions.endLoading);
    throw error;
  }
};

export const insertChequeByCashier = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    await graphQlAxiosInstance.post('', {
      query: insertChequeUpdatePayment,
      variables: {
        cheque: data.cheque,
        paymentId: data.paymentId,
        newState: { status: 'DONE' },
      },
    });
    dispatch(slice.actions.endLoading);
    dispatch(
      slice.actions.insertCheque({
        payment_id: data.paymentId,
        cheque: data.cheque,
      })
    );
  } catch (error) {
    dispatch(slice.actions.endLoading);
    throw error;
  }
};

export const addFollowups = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    const res = await graphQlAxiosInstance.post('', {
      query: createNewFollowUp,
      variables: {
        object: data,
      },
    });
    dispatch(slice.actions.endLoading);
    dispatch(
      slice.actions.insertFollowUp({
        follow_up: res.data.data.insert_proposal_follow_up_one,
      })
    );
  } catch (error) {
    dispatch(slice.actions.endLoading);
    throw error;
  }
};

// export const addFollowups = (data: any, role: any) => async () => {
//   try {
//     dispatch(slice.actions.startLoading());
//     const response = await axiosInstance.post(
//       'tender-proposal/follow-up/create',
//       {
//         ...data,
//       },
//       {
//         headers: { 'x-hasura-role': role },
//       }
//     );
//     dispatch(slice.actions.insertFollowUp(response.data.data));
//     dispatch(slice.actions.endLoading());
//   } catch (error) {
//     dispatch(slice.actions.endLoading());
//     throw error;
//   }
// };

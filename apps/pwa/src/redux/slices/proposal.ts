import { LoadingButtonProps } from '@mui/lab';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { createNewFollowUp } from 'queries/commons/createNewFollowUp';
import { getOneProposal } from 'queries/commons/getOneProposal';
import { dispatch } from 'redux/store';
import { IRegions } from 'sections/admin/region/list/types';
import { IBeneficiaries } from 'sections/client/funding-project-request/forms/MainInfoForm';
import axiosInstance from 'utils/axios';
import graphQlAxiosInstance from 'utils/axisoGraphQlInstance';
import { removeEmptyKey } from 'utils/remove-empty-key';
import {
  ActiveTap,
  BeneficiaryDetail,
  IClientList,
  LoadingProps,
  Proposal,
  ProposalCount,
  tracks,
  UpdateStatus,
} from '../../@types/proposal';
import moment from 'moment';

// ----------------------------------------------------------------------

interface ProposalItme {
  isLoading: boolean;
  loadingCount: boolean;
  loadingPayment: boolean;
  loadingProps: LoadingProps;
  error: Error | string | null;
  activeTap: ActiveTap;
  checkedItems: any;
  tracks: string[];
  employeeOnly: boolean;
  proposal: Proposal;
  proposalCount: ProposalCount;
  updateStatus: UpdateStatus;
  track_list: tracks[];
  beneficiaries_list: BeneficiaryDetail[];
  region_list: IRegions[];
  client_list: IClientList[];
  // governorate_list: IGovernorate[];
}

const initialState: ProposalItme = {
  isLoading: false,
  loadingCount: false,
  loadingPayment: false,
  loadingProps: {
    laodingTrack: false,
    loadingBeneficiary: false,
    laodingClient: false,
    loadingGovernorate: false,
    loadingRegion: false,
  },
  error: null,
  activeTap: 'main',
  checkedItems: [],
  tracks: ['MOSQUES', 'CONCESSIONAL_GRANTS', 'INITIATIVES', 'BAPTISMS'],
  employeeOnly: false,
  updateStatus: 'no-change',
  track_list: [],
  beneficiaries_list: [
    {
      id: '-1',
      name: 'test',
      is_deleted: false,
    },
  ],
  client_list: [
    {
      id: '-1',
      email: 'test',
      employee_name: 'test',
      mobile_number: 'test',
      status_id: 'test',
      proposal_count: 0,
    },
  ],
  region_list: [
    {
      region_id: '-1',
      name: 'test',
      is_deleted: false,
      governorate: [
        {
          region_id: '-1',
          governorate_id: '-1',
          name: 'test',
          is_deleted: false,
        },
      ],
    },
  ],
  proposalCount: {
    incoming: 0,
    inprocess: 0,
    previous: 0,
    close_report: 0,
    payment_adjustment: 0,
    complete_close_report: 0,
    pending_closing_report: 0,
  },
  proposal: {
    id: '-1',
    project_name: 'test',
    project_implement_date: moment().format('YYYY-MM-DD'),
    project_location: 'test',
    project_track: 'test',
    submitter_user_id: 'test',
    project_number: 0,
    closing_report: false,
    need_picture: false,
    does_an_agreement: false,
    vat: false,
    vat_percentage: 0,
    inclu_or_exclu: false,
    support_goal_id: 'test',
    support_outputs: 'test',
    accreditation_type_id: 'PLAIN',
    governorate: 'test',
    track_id: 'test',
    clasification_field: 'test',
    notes: 'test',
    beneficiary_details: {
      id: '-1',
      name: 'no-data',
      is_deleted: false,
    },
    track_budget: {
      id: '-1',
      name: 'no-data',
      total_budget: 0,
      total_reserved_budget: 0,
      total_spending_budget: 0,
    },
    project_timeline: [
      {
        id: '-1',
        name: 'test',
        start_date: new Date('10-10-2022'),
        end_date: new Date('10-10-2022'),
        proposal_id: '-1',
      },
    ],
    track: {
      id: '-1',
      name: 'test',
      with_consultation: false,
      created_at: new Date('10-10-2022'),
      is_grant: false,
    },
    proposal_logs: [
      {
        id: '-1',
        proposal_id: '-1',
        updated_at: new Date('10-10-2022'),
        created_at: new Date('10-10-2022'),
        message: 'test',
        notes: 'test',
        reject_reason: 'test',
        // response_time: 'test',
        reviewer_id: 'test',
        state: 'test',
        user_role: 'CLIENT',
        action: 'accept',
        reviewer: {
          employee_name: 'test',
        },
        user_role_id: 'test',
        employee_name: 'test',
      },
    ],
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
        chairman_name: 'test',
        ceo_name: 'test',
        entity: 'test',
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
        created_at: new Date('10-10-2022'),
      },
    ],
    remote_or_insite: 'both',
    // target_group_age: 0,
    target_group_age: '',
    target_group_num: 0,
    target_group_type: '',
    created_at: new Date('10-10-2022'),
    updated_at: new Date('10-10-2022'),
    num_ofproject_binicficiaries: 0,
    region: 'test',
    execution_time: 0,
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
    pm_email: 'test',
    pm_mobile: 'test',
    pm_name: 'test',
    amount_required_fsupport: 0,
    fsupport_by_supervisor: 0,
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
        status: 'set_by_supervisor',
        order: 'test',
        created_at: new Date('10-10-2022'),
        cheques: [
          {
            id: 'test',
            number: 0,
            payment_id: 0,
            transfer_receipt: {
              size: 0,
              url: '',
              type: '',
            },
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
        created_at: new Date('10-10-2022'),
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
    section_id: '',
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
    // START LOADING COUNT
    startLoadingCount(state) {
      state.loadingCount = true;
    },
    // loading when fetcing region
    startLoadingRegion(state, action) {
      state.loadingProps.loadingRegion = action.payload;
    },
    // loading when fetcing governorate
    startLoadingGovernorate(state, action) {
      state.loadingProps.loadingGovernorate = action.payload;
    },
    // loading when fetcing client
    startLoadingClient(state, action) {
      state.loadingProps.laodingClient = action.payload;
    },
    // loading when fetcing track
    startLoadingTrack(state, action) {
      state.loadingProps.laodingTrack = action.payload;
    },
    // loading when fetcing beneficiary
    startLoadingBeneficiary(state, action) {
      state.loadingProps.loadingBeneficiary = action.payload;
    },
    setLoadingCount(state, action) {
      state.loadingCount = action.payload;
    },
    setLoadingFetchin(state, action) {
      state.isLoading = action.payload;
    },
    setLoadingPayment(state, action) {
      state.loadingPayment = action.payload;
    },
    // END LOADING COUNT
    endLoadingCount(state) {
      state.loadingCount = false;
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
    // SET TRACKS FOR PROJECT MANAGEMENT
    setTracks(state, action) {
      state.tracks = action.payload;
    },
    // SET TRACKS FOR PROJECT MANAGEMENT
    setTrackList(state, action) {
      state.track_list = action.payload;
    },
    setBeneficiariesList(state, action) {
      state.beneficiaries_list = action.payload;
    },
    setClientList(state, action) {
      state.client_list = action.payload;
    },
    setRegionList(state, action) {
      state.region_list = action.payload;
    },
    setTrackBudget(state, action) {
      state.proposal.track_budget = action.payload;
    },
    // SET EMPLOYEE ONLY
    setEmployeeOnly(state, action) {
      state.employeeOnly = action.payload;
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
      if (!!status) {
        state.proposal.payments[payment_index].status = status;
      }
    },
    // INSERT CHEQUE
    insertCheque(state, action) {
      const { payment_id, cheque } = action.payload;
      const payment_index = state.proposal.payments.findIndex(
        (payment) => payment.id === payment_id
      );
      state.proposal.payments[payment_index].cheques.push(cheque);
      state.proposal.payments[payment_index].status = 'done';
    },
    // INSERT FOLLOWUPS
    insertFollowUp(stat, action) {
      stat.proposal.follow_ups.push(action.payload.follow_up);
    },
    // UPDATE STATUS ACCEPTED DATA BY SUPERVISOR
    setUpdatedStatus(state, action) {
      state.updateStatus = action.payload;
    },
    setProposalCount(state, action) {
      state.proposalCount = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setProposal,
  setActiveTap,
  setTrackList,
  setCheckedItems,
  setTracks,
  setEmployeeOnly,
  setTrackBudget,
  setProposalCount,
  setUpdatedStatus,
  setLoadingPayment,
  setLoadingFetchin,
  setRegionList,
} = slice.actions;

export const getProposal = (id: string, role: string) => async () => {
  // console.log('masuk sini', id, role);
  try {
    // dispatch(slice.actions.startLoading);
    dispatch(slice.actions.setLoadingPayment(true));
    dispatch(slice.actions.setLoadingFetchin(true));
    // dispatch(slice.actions.setLoadingCount(true));
    if (
      role === 'tender_admin' ||
      role === 'tender_ceo' ||
      role === 'tender_project_manager' ||
      role === 'tender_project_supervisor' ||
      role === 'tender_moderator' ||
      role === 'tender_finance' ||
      role === 'tender_client' ||
      role === 'tender_cashier' ||
      role === 'tender_consultant' ||
      role === 'tender_accounts_manager' ||
      role === 'tender_auditor_report' ||
      role === 'tender_portal_report'
    ) {
      try {
        const url = `tender-proposal/fetch-by-id?id=${id}`;

        const response = await axiosInstance.get(url, {
          headers: { 'x-hasura-role': role },
        });
        if (response.data.statusCode === 200) {
          dispatch(slice.actions.setProposal(response.data.data));
          if (
            role === 'tender_project_manager' ||
            role === 'tender_project_supervisor' ||
            role === 'tender_finance' ||
            role === 'tender_cashier' ||
            role === 'tender_auditor_report' ||
            role === 'tender_portal_report'
          ) {
            try {
              const url = `/tender/track/${response.data.data.track_id as string}`;
              const res = await axiosInstance.get(url, {
                headers: { 'x-hasura-role': role },
                params: {
                  include_relations: `count_budget`,
                },
              });
              dispatch(slice.actions.setTrackBudget(res.data.data.data));
            } catch (err) {
              console.error(err);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const res = await graphQlAxiosInstance.post(
        '',
        {
          query: getOneProposal,
          variables: { id },
        },
        {
          headers: {
            'x-hasura-role': `${role}`,
          },
        }
      );
      dispatch(slice.actions.setProposal(res.data.data.proposal));
    }

    dispatch(slice.actions.endLoading);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.setLoadingPayment(false));
    dispatch(slice.actions.setLoadingFetchin(false));
    // dispatch(slice.actions.setLoadingCount(false));
  }
};
export const getTrackList =
  (isGeneral: number, role: string, isDeleted?: number, track_id?: string) => async () => {
    try {
      dispatch(slice.actions.startLoadingTrack(true));
      let url = '/tender/track';
      const tmpParams = {
        include_general: isGeneral ? '1' : undefined,
        is_deleted: isDeleted === 1 ? '1' : isDeleted === 0 ? '0' : undefined,
        track_id,
      };
      try {
        const response = await axiosInstance.get(url, {
          headers: { 'x-hasura-role': role },
          params: {
            ...removeEmptyKey(tmpParams),
            limit: 999,
          },
        });
        if (response.data.statusCode === 200) {
          if (track_id) {
            dispatch(
              slice.actions.setTrackList(
                response.data.data.filter((item: tracks) => item.id === track_id)
              )
            );
          } else {
            dispatch(slice.actions.setTrackList(response.data.data));
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.startLoadingTrack(false));
    }
  };
export const getBeneficiariesList = (role: string, showActive: boolean) => async () => {
  try {
    // dispatch(slice.actions.startLoading);
    dispatch(slice.actions.startLoadingBeneficiary(true));
    // dispatch(slice.actions.setLoadingCount(true));
    const url = '/tender/proposal/beneficiaries/find-all?limit=0';
    try {
      const response = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': role },
      });
      if (response.data.statusCode === 200) {
        const tmpValues =
          response.data.data.filter((item: IBeneficiaries) => item.is_deleted !== true) || [];
        // dispatch(slice.actions.setBeneficiariesList(showActive ? tmpValues : response.data.data));
        dispatch(slice.actions.setBeneficiariesList(showActive ? tmpValues : response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    // dispatch(slice.actions.endLoading);
    // dispatch(slice.actions.setLoadingCount(false));
    dispatch(slice.actions.startLoadingBeneficiary(false));
  }
};

export const getClientList = (role: string) => async () => {
  try {
    dispatch(slice.actions.startLoadingClient(true));
    const url = '/tender/client/proposal/list?limit=99999';
    try {
      const response = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': role },
      });
      if (response.data.statusCode === 200) {
        const tmpValues =
          response.data.data.filter((item: IBeneficiaries) => item.is_deleted !== true) || [];
        dispatch(slice.actions.setClientList(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    dispatch(slice.actions.startLoadingClient(false));
  }
};

export const getRegionList = () => async () => {
  try {
    // dispatch(slice.actions.startLoading);
    dispatch(slice.actions.setLoadingCount(true));
    dispatch(slice.actions.startLoadingRegion(true));
    try {
      const response = await axios.get(
        `${TMRA_RAISE_URL}/region-management/regions?include_relations=governorate&limit=0`
      );
      if (response.data.statusCode === 200) {
        const tmpValues =
          // response.data.data.filter((item: IBeneficiaries) => item.is_deleted !== true) || [];
          dispatch(slice.actions.setRegionList(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  } finally {
    // dispatch(slice.actions.endLoading);
    dispatch(slice.actions.setLoadingCount(false));
    dispatch(slice.actions.startLoadingRegion(false));
  }
};

export const getProposalCount = (role: string) => async () => {
  if (role !== 'test') {
    dispatch(slice.actions.setLoadingCount(true));
    try {
      const url = `/tender-proposal/proposal-count`;
      try {
        const response = await axiosInstance.get(url, {
          headers: { 'x-hasura-role': role },
        });
        if (response.data.statusCode === 200) {
          // console.log(response.data, 'test response');
          dispatch(slice.actions.setProposalCount(response.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.setLoadingCount(false));
    }
  }
};
export const insertPaymentsBySupervisor = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);

    const variables = {
      payments: data.payments,
      proposal_id: data.proposal_id,
    };
    // const url = '/tender/proposal/payment/insert-payment'
    const url = '/tender/proposal/payment/insert-payment-cqrs';
    const res = await axiosInstance.post(url, variables, {
      headers: { 'x-hasura-role': data.role },
    });
    // const res = await graphQlAxiosInstance.post('', {
    //   query: insertPayments,
    //   variables: {
    //     payments: data.payments,
    //     proposalId: data.id,
    //     approveProposalPayloads: {
    //       inner_status: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
    //       outter_status: 'ONGOING',
    //       state: 'PROJECT_MANAGER',
    //     },
    //   },
    // });

    if (res.data.statusCode === 201) {
      dispatch(
        slice.actions.setPayments({
          payments: data.payments.map((v: any) => ({
            ...v,
            status: 'set_by_supervisor',
          })),
          // updatedData: res.data.data.update_proposal.returning[0],
          updatedData: res.data.data,
        })
      );
    }

    dispatch(slice.actions.endLoading);

    return res.data;
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.endLoading);
    throw error;
  }
};

export const updatePaymentBySupervisorAndManagerAndFinance = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);

    const variables = {
      payment_id: data.id,
      action: data.action,
      notes: data.note,
      last_payment_receipt_url: data.url,
    };
    // const url = '/tender/proposal/payment/update-payment';
    const url = '/tender/proposal/payment/update-payment-cqrs';
    const res = await axiosInstance.patch(url, variables, {
      headers: { 'x-hasura-role': data.role },
    });
    // const res = await axiosInstance.post(url, variables, {
    //   headers: { 'x-hasura-role': data.role },
    // });
    // const res = await graphQlAxiosInstance.post('', {
    //   query: updatePayment,
    //   variables: {
    //     id: data.id,
    //     newState: { status: data.status },
    //   },
    // });

    if (
      res &&
      res.data &&
      res.data.statusCode === 200 &&
      res.data.data &&
      res.data.data.updatedPayment
    ) {
      dispatch(
        slice.actions.editPayment({
          payment_id: data.id,
          status: res.data.data.updatedPayment.status,
        })
      );
    }

    dispatch(slice.actions.endLoading);

    return res.data;
  } catch (error) {
    dispatch(slice.actions.endLoading);
    throw error;
  }
};

export const updateAcceptedDataProposalNonGrants = (data: any, activeRole: string) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    // const variables = {
    //   proposal_id: data.proposal_id,
    //   action: data.action,
    //   message: data.message,
    //   notes: data.notes,
    //   supervisor_payload: {
    //     ...data.supervisor_payload,
    //   },
    //   selectLang: data.selectLang,
    // };

    const res = await axiosInstance.patch('/tender-proposal/change-state', data, {
      headers: { 'x-hasura-role': activeRole },
    });

    if (res.data.statusCode === 200) {
      dispatch(slice.actions.setUpdatedStatus('updated'));
    }

    dispatch(slice.actions.endLoading);

    // return res.data;
  } catch (error) {
    dispatch(slice.actions.endLoading);
    dispatch(slice.actions.setUpdatedStatus('error'));
    throw error;
  }
};

export const insertChequeByCashier = (data: any) => async () => {
  try {
    dispatch(slice.actions.startLoading);
    // await graphQlAxiosInstance.post('', {
    //   query: insertChequeUpdatePayment,
    //   variables: {
    //     cheque: data.cheque,
    //     paymentId: data.paymentId,
    //     newState: { status: 'done' },
    //   },
    // });

    const variables = {
      payment_id: data.id,
      action: data.action,
      cheque: data.cheque,
    };
    // const url = /tender/proposal/payment/update-payment
    const url = '/tender/proposal/payment/update-payment-cqrs';

    const res = await axiosInstance.patch(url, variables, {
      headers: { 'x-hasura-role': data.role },
    });

    if (res.data.statusCode === 200) {
      dispatch(
        slice.actions.insertCheque({
          payment_id: data.id,
          cheque: data.cheque,
        })
      );
    }

    dispatch(slice.actions.endLoading);

    return res.data;
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

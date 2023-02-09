import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from 'redux/store';
import {
  SupervisorStep1,
  SupervisorStep2,
  SupervisorStep3,
  SupervisorStep4,
  SupervisorStep5,
} from '../../@types/supervisor-accepting-form';

// ----------------------------------------------------------------------

interface SupervisorAcceptingForm {
  isLoading: boolean;
  error: Error | string | null;
  activeStep: number;
  step1: SupervisorStep1;
  step2: SupervisorStep2;
  step3: SupervisorStep3;
  step4: SupervisorStep4;
  step5: SupervisorStep5;
}

const initialState: SupervisorAcceptingForm = {
  isLoading: false,
  error: null,
  activeStep: 0,
  step1: {
    clause: '',
    clasification_field: '',
    support_type: undefined,
    closing_report: undefined,
    need_picture: undefined,
    does_an_agreement: undefined,
    fsupport_by_supervisor: undefined,
    // number_of_payments_by_supervisor: undefined,
    notes: '',
    support_outputs: '',
    vat: undefined,
    vat_percentage: undefined,
    inclu_or_exclu: undefined,
    support_goal_id: '',
    accreditation_type_id: '',
  },
  step2: {
    organizationName: '',
    region: '',
    governorate: '',
    date_of_esthablistmen: new Date(),
    chairman_of_board_of_directors: '',
    ceo: '',
    been_supported_before: false,
    most_clents_projects: '',
    num_of_beneficiaries: 0,
  },
  step3: {
    project_name: '',
    project_idea: '',
    project_goals: '',
    amount_required_fsupport: 0,
    added_value: '',
    reasons_to_accept: '',
    project_beneficiaries: '',
    target_group_num: undefined,
    target_group_type: '',
    target_group_age: undefined,
    project_implement_date: new Date(),
    execution_time: 0,
    project_location: '',
    been_made_before: false,
    remote_or_insite: false,
  },
  step4: { proposal_item_budgets: [{ amount: undefined, clause: '', explanation: '' }] },
  step5: {
    recommended_support: [
      {
        clause: '',
        explanation: '',
        amount: undefined,
      },
    ],
  },
};

const slice = createSlice({
  name: 'supervisorAcceptingForm',
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
    // SET STEPS DATA
    setStepsData(state, action) {
      state.step2.organizationName = action.payload.user.employee_name;
      state.step2.region = action.payload.user.client_data.region;
      state.step2.governorate = action.payload.user.client_data.governorate;
      state.step2.date_of_esthablistmen = action.payload.user.client_data.date_of_esthablistmen;
      state.step2.num_of_beneficiaries = action.payload.user.client_data.num_of_beneficiaries;
      state.step3.project_name = action.payload.project_name;
      state.step3.project_idea = action.payload.project_idea;
      state.step3.project_goals = action.payload.project_goals;
      state.step3.amount_required_fsupport = action.payload.amount_required_fsupport;
      state.step3.project_beneficiaries = action.payload.project_beneficiaries;
      state.step3.project_implement_date = action.payload.project_implement_date;
      state.step3.execution_time = action.payload.execution_time;
      state.step3.project_location = action.payload.project_location;
      state.step4.proposal_item_budgets = action.payload.proposal_item_budgets;
    },
    // STEP ONE
    setStepOne(state, action) {
      state.isLoading = true;
      state.step1 = action.payload;
      state.activeStep = state.activeStep + 1;
      state.isLoading = false;
    },
    // STEP TWO
    setStepTwo(state, action) {
      state.isLoading = true;
      state.step2 = action.payload;
      state.activeStep = state.activeStep + 1;
      state.isLoading = false;
    },
    // STEP THREE
    setStepThree(state, action) {
      state.isLoading = true;
      state.step3 = action.payload;
      state.activeStep = state.activeStep + 1;
      state.isLoading = false;
    },
    // STEP FOUR
    setStepFour(state, action) {
      state.isLoading = true;
      state.step4 = action.payload;
      state.activeStep = state.activeStep + 1;
      state.isLoading = false;
    },
    // STEP FIVE
    setStepFive(state, action) {
      state.isLoading = true;
      state.step5 = action.payload;
      state.isLoading = false;
    },
    // SET STATE
    stepBackOne(state, action) {
      state.activeStep = state.activeStep - 1;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { stepBackOne } = slice.actions;

export const setStepsData = (data: any) => async () => {
  dispatch(slice.actions.setStepsData(data));
};

export const setStepOne = (data: SupervisorStep1) => async () => {
  dispatch(slice.actions.setStepOne(data));
};

export const setStepTwo = (data: SupervisorStep2) => async () => {
  dispatch(slice.actions.setStepTwo(data));
};

export const setStepThree = (data: SupervisorStep3) => async () => {
  dispatch(slice.actions.setStepThree(data));
};

export const setStepFour = (data: SupervisorStep4) => async () => {
  dispatch(slice.actions.setStepFour(data));
};

export const setStepFive = (data: SupervisorStep5) => async () => {
  dispatch(slice.actions.setStepFive(data));
};

import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from 'redux/store';
import {
  SupervisorStep1,
  SupervisorStep2,
  SupervisorStep3,
  SupervisorStep4,
  SupervisorStep5,
  project_beneficiaries_map,
  BeneficiariesMap,
  target_type_map,
  target_age_map,
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
    payment_number: 0,
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
    // target_group_age: undefined,
    target_group_age: '',
    project_implement_date: new Date(),
    execution_time: 0,
    project_location: '',
    been_made_before: false,
    remote_or_insite: 'both',
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
      // console.log(action.payload);
      // step 1
      state.step1.clause = action.payload.clause ?? '';
      state.step1.clasification_field = action.payload.clasification_field ?? '';
      state.step1.support_type = action.payload.support_type ?? undefined;
      state.step1.closing_report = action.payload.closing_report ?? undefined;
      state.step1.need_picture = action.payload.need_picture ?? undefined;
      state.step1.does_an_agreement = action.payload.does_an_agreement ?? undefined;
      state.step1.fsupport_by_supervisor = action.payload.fsupport_by_supervisor ?? undefined;
      state.step1.notes = action.payload.notes ?? '';
      state.step1.support_outputs = action.payload.support_outputs ?? '';
      state.step1.vat = action.payload.vat ?? undefined;
      state.step1.vat_percentage = action.payload.vat_percentage ?? undefined;
      state.step1.inclu_or_exclu = action.payload.inclu_or_exclu ?? undefined;
      state.step1.support_goal_id = action.payload.support_goal_id ?? '';
      state.step1.accreditation_type_id = action.payload.accreditation_type_id ?? '';
      state.step1.payment_number = action.payload.proposal_item_budgets.length ?? 0;
      //step 2
      state.step2.organizationName = action.payload.user.employee_name ?? '';
      state.step2.region = action.payload.user.client_data.region ?? '';
      state.step2.governorate = action.payload.user.client_data.governorate ?? '';
      state.step2.date_of_esthablistmen =
        action.payload.user.client_data.date_of_esthablistmen ?? new Date();
      state.step2.num_of_beneficiaries = action.payload.user.client_data.num_of_beneficiaries ?? 0;
      state.step2.chairman_of_board_of_directors =
        action.payload.user.client_data.chairman_name || '';
      state.step2.ceo = action.payload.user.client_data.ceo_name ?? '';
      state.step2.most_clents_projects = action.payload.most_clents_projects ?? '';
      //step 3
      state.step2.been_supported_before = action.payload.been_supported_before || false;
      state.step3.project_name = action.payload.project_name;
      state.step3.project_idea = action.payload.project_idea;
      state.step3.project_goals = action.payload.project_goals;
      state.step3.amount_required_fsupport = action.payload.amount_required_fsupport;
      // state.step3.project_beneficiaries =
      //   project_beneficiaries_map[action.payload.project_beneficiaries as keyof BeneficiariesMap];
      state.step3.project_beneficiaries =
        action?.payload?.beneficiary_details?.name ||
        project_beneficiaries_map[action.payload.project_beneficiaries as keyof BeneficiariesMap];
      state.step3.project_implement_date = action.payload.project_implement_date;
      state.step3.execution_time = action.payload.execution_time;
      state.step3.project_location = action.payload.project_location;
      state.step3.been_made_before = action.payload.been_made_before || false;
      state.step3.added_value = action.payload.added_value ?? '';
      state.step3.target_group_age =
        (action.payload.target_group_age &&
          target_age_map[
            action.payload.target_group_age.toUpperCase() as keyof BeneficiariesMap
          ]) ??
        '';
      // state.step3.target_group_age = action.payload.target_group_type ?? undefined;
      state.step3.target_group_type =
        (action.payload.target_group_type &&
          target_type_map[
            action.payload.target_group_type.toUpperCase() as keyof BeneficiariesMap
          ]) ??
        '';
      state.step3.target_group_num = action.payload.target_group_num ?? undefined;
      state.step3.reasons_to_accept = action.payload.reasons_to_accept ?? '';
      state.step3.been_made_before = action.payload.been_made_before ?? false;
      state.step3.remote_or_insite = action.payload.remote_or_insite ?? 'both';
      //step 4
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
    // RESET ActiveStep
    stepResetActive(state, action) {
      state.activeStep = 0;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { stepBackOne, stepResetActive } = slice.actions;

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

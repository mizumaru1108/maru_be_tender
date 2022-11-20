import { Box, Button, Grid, Stack, Step, StepLabel, Stepper, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import React, { useState } from 'react';
import FirstForm from './FirstForm';
import SecondForm from './SecondForm';
import ThirdForm from './ThirdForm';
import ActionBox from './ActionBox';
import ForthFrom from './ForthFrom';
import FifthForm from './FifthForm';
import { nanoid } from 'nanoid';
import { useMutation } from 'urql';
import { useNavigate, useParams } from 'react-router';
import useAuth from 'hooks/useAuth';
import { approveProposal } from 'queries/commons/approveProposal';
import { insertSupervisor } from 'queries/project-supervisor/insertSupervisor';

type ConsultantForm = {
  chairman_of_board_of_directors: string;
  been_supported_before: boolean;
  most_clents_projects: string;
  added_value: string;
  reasons_to_accept: string;
  target_group_num: number;
  target_group_type: string;
  target_group_age: number;
  been_made_before: boolean;
  remote_or_insite: boolean;
  recommended_support: Array<{ clause: string; explanation: string; amount: number }>;
  clause: string;
};
const steps = ['first step', 'second step', 'third step', 'forth step', 'fifth step'];

function FloatinActionBar({ organizationId, data }: any) {
  const navigate = useNavigate();
  const { id: proposal_id } = useParams();
  const { user } = useAuth();
  const supervisor_id = user?.id;
  const [step, setStep] = React.useState(0);
  const { translate } = useLocales();
  const theme = useTheme();
  const [action, setAction] = useState<
    'accept' | 'reject' | 'edit_request' | 'send_client_message'
  >('reject');

  const [proposalAccepting, accept] = useMutation(approveProposal);
  const [supervisorAcceptance, insertSupervisorAcceptance] = useMutation(insertSupervisor);
  const [modalState, setModalState] = useState(false);

  const defaultValues = {
    form1: {
      clause: '',
      clasification_field: '',
      support_type: undefined,
      closing_report: undefined,
      need_picture: undefined,
      does_an_agreement: undefined,
      support_amount: undefined,
      number_of_payments: undefined,
      procedures: '',
      notes: '',
      support_outputs: '',
      vat: undefined,
      vat_percentage: undefined,
      inclu_or_exclu: undefined,
    },
    form2: {
      organizationName: data?.user?.employee_name,
      region: data?.user?.client_data?.region,
      governorate: data?.user?.client_data?.governorate,
      date_of_esthablistmen: data?.user?.client_data?.date_of_esthablistmen,
      chairman_of_board_of_directors: '',
      ceo: '',
      been_supported_before: false,
      most_clents_projects: '',
      num_of_beneficiaries: data?.user?.client_data?.num_of_beneficiaries,
    },
    form3: {
      project_name: data.project_name,
      project_idea: data.project_idea,
      project_goals: data.project_goals,
      amount_required_fsupport: data.amount_required_fsupport,
      added_value: '',
      reasons_to_accept: '',
      project_beneficiaries: data.project_beneficiaries,
      target_group_num: undefined,
      target_group_type: '',
      target_group_age: undefined,
      project_implement_date: data.project_implement_date,
      execution_time: data.execution_time,
      project_location: data.project_location,
      been_made_before: false,
      remote_or_insite: false,
    },
    form4: {
      proposal_item_budgets: data.proposal_item_budgets,
    },
    form5: {
      recommended_support: [
        {
          clause: '',
          explanation: '',
          amount: undefined,
        },
      ],
      clause: '',
    },
  };

  const [_, insertConsultantForm] =
    useMutation(`mutation InsertConsultantForm($objects: [consultant_form_insert_input!] = {}) {
    insert_consultant_form(objects: $objects) {
      affected_rows
    }
  }
  `);

  const [consultantForm, setConsultantForm] = React.useState<ConsultantForm>();
  const [formValues, setFormValues] = React.useState(defaultValues);

  const onBack = () => {
    setStep(step - 1);
  };
  const handleOpenModal = () => {
    setModalState(true);
  };
  const handleCloseModal = () => {
    setModalState(false);
  };
  const handleSubmitFirstForm = (data: any) => {
    setFormValues((prevValues: any) => ({
      ...prevValues,
      form1: { ...prevValues.form1, ...data },
    }));
    setStep(step + 1);
  };
  const handleSubmitSecondForm = (data: any) => {
    setConsultantForm((prevValue: any) => ({
      ...prevValue,
      chairman_of_board_of_directors: data.chairman_of_board_of_directors,
      been_supported_before: data.been_supported_before,
      most_clents_projects: data.most_clents_projects,
    }));
    setStep(step + 1);
  };
  const handleSubmitThirdForm = (data: any) => {
    setConsultantForm((prevValues: any) => ({
      ...prevValues,
      added_value: data.added_value,
      reasons_to_accept: data.reasons_to_accept,
      target_group_num: data.target_group_num,
      target_group_type: data.target_group_type,
      target_group_age: data.target_group_age,
      been_made_before: data.been_made_before,
      remote_or_insite: data.remote_or_insite,
    }));
    setStep(step + 1);
  };
  const handleSubmitForthForm = (data: any) => {
    setStep(step + 1);
  };
  const handleSubmitFifthForm = async (data: any) => {
    setConsultantForm((prevValue: any) => ({
      ...prevValue,
      recommended_support: { data: data.recommended_support },
      clause: data.clause,
    }));
    try {
      await insertConsultantForm({
        objects: {
          ...consultantForm,
          recommended_support: {
            data: data.recommended_support.map((item: any, index: any) => ({
              clause: item.clause,
              amount: item.amount,
              explanation: item.explanation,
              id: nanoid(),
            })),
          },
          clause: data.clause,
          proposal_id,
          supervisor_id,
          id: nanoid(),
        },
      });
      await insertSupervisorAcceptance({
        supervisorAcceptance: {
          ...formValues.form1,
          id: nanoid(),
          proposal_id,
          user_id: organizationId,
        },
      });
      await accept({
        proposalId: proposal_id,
        approveProposalPayloads: {
          inner_status: 'ACCEPTED_AND_NEED_CONSULTANT',
          outter_status: 'PENDING',
          state: 'CONSULTANT',
          number_of_payments: formValues.form1.number_of_payments,
        },
      });
      navigate('/project-supervisor/dashboard/app');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
          position: 'sticky',
          width: '100%',
          bottom: 24,
          border: `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Grid container rowSpacing={5} alignItems="center" justifyContent="space-around">
          <Grid item md={5} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                onClick={() => {
                  setAction('accept');
                  handleOpenModal();
                }}
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1 }}
              >
                {translate('accept_project')}
              </Button>
              <Button
                sx={{
                  flex: 1,
                  backgroundColor: '#FF4842',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
                variant="contained"
                onClick={() => {
                  setAction('reject');
                  handleOpenModal();
                }}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
            </Stack>
          </Grid>
          <Grid item md={2}>
            <Box>{''}</Box>
          </Grid>
          <Grid item md={5}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="eva:message-circle-outline" />}
                onClick={() => setAction('send_client_message')}
                sx={{ flex: 1 }}
              >
                {translate('partner_details.send_messages')}
              </Button>
              <Button
                variant="contained"
                endIcon={<Iconify icon="eva:edit-2-outline" />}
                onClick={() => setAction('edit_request')}
                sx={{
                  flex: 1,
                  backgroundColor: '#0169DE',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
              >
                {translate('partner_details.submit_amendment_request')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <ModalDialog
        maxWidth="md"
        title={step === 0 ? 'قبول المشروع' : 'البيانات التي تعرض على لجنة المنح'}
        isOpen={modalState}
        content={
          <>
            {action === 'accept' && (
              <>
                <Stepper activeStep={step} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {step === 0 && (
                  <FirstForm
                    onSubmit={handleSubmitFirstForm}
                    defaultValues={formValues.form1}
                    data={data}
                  >
                    <ActionBox
                      action="accept"
                      isLoading={false}
                      onReturn={handleCloseModal}
                      step={step}
                      onBack={onBack}
                    />
                  </FirstForm>
                )}
                {step === 1 && (
                  <SecondForm onSubmit={handleSubmitSecondForm} defaultValues={formValues.form2}>
                    <ActionBox
                      action="accept"
                      isLoading={false}
                      onReturn={handleCloseModal}
                      step={step}
                      onBack={onBack}
                    />
                  </SecondForm>
                )}
                {step === 2 && (
                  <ThirdForm onSubmit={handleSubmitThirdForm} defaultValues={formValues.form3}>
                    <ActionBox
                      action="accept"
                      isLoading={false}
                      onReturn={handleCloseModal}
                      step={step}
                      onBack={onBack}
                    />
                  </ThirdForm>
                )}
                {step === 3 && (
                  <ForthFrom onSubmit={handleSubmitForthForm} defaultValues={formValues.form4}>
                    <ActionBox
                      action="accept"
                      isLoading={false}
                      onReturn={handleCloseModal}
                      step={step}
                      onBack={onBack}
                    />
                  </ForthFrom>
                )}
                {step === 4 && (
                  <FifthForm onSubmit={handleSubmitFifthForm} defaultValues={formValues.form5}>
                    <ActionBox
                      action="accept"
                      isLoading={false}
                      onReturn={handleCloseModal}
                      step={step}
                      onBack={onBack}
                    />
                  </FifthForm>
                )}
              </>
            )}
          </>
        }
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </>
  );
}

export default FloatinActionBar;

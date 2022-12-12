import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  useTheme,
} from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import React from 'react';
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
import { useSnackbar } from 'notistack';
import { ProposalAcceptBySupervisorFacilitateGrant } from 'queries/project-supervisor/ProposalAcceptBySupervisorFacilitateGrant';
import { ProposalRejectBySupervisor } from 'queries/project-supervisor/ProposalAcceptBySupervisor';
import ProposalRejectingForm from './ProposalRejectingForm';
import { ProposalRejectBySupervisorFacilitateGrant } from 'queries/project-supervisor/ProposalRejectBySupervisorFacilitateGrant';

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
const steps = [
  'معلومات الدعم',
  'معلومات الجهة',
  'تفاصيل المشروع',
  'موازنة المشروع',
  'التوصية بالدعم من المشرف',
];

function FloatinActionBar({ organizationId, data }: any) {
  const navigate = useNavigate();
  const { id: proposal_id } = useParams();
  const { user } = useAuth();
  const supervisor_id = user?.id;
  const [step, setStep] = React.useState(0);
  const { translate } = useLocales();
  const theme = useTheme();
  const [action, setAction] = React.useState<
    'accept' | 'reject' | 'edit_request' | 'send_client_message' | ''
  >('');

  const { enqueueSnackbar } = useSnackbar();

  const [, accept] = useMutation(ProposalAcceptBySupervisorFacilitateGrant);

  const [, stepBack] = useMutation(ProposalRejectBySupervisor);

  const [, reject] = useMutation(ProposalRejectBySupervisorFacilitateGrant);

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
      notes: '',
      support_outputs: '',
      vat: undefined,
      vat_percentage: undefined,
      inclu_or_exclu: undefined,
      support_goals: '',
      clasue_cons: '',
      accreditation_type: '',
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
    },
  };

  const [consultantForm, setConsultantForm] = React.useState<ConsultantForm>();

  const [formValues, setFormValues] = React.useState(defaultValues);

  const [modalState, setModalState] = React.useState(false);

  const [loadingState, setLoadingState] = React.useState({ isLoading: false, action: '' });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    const { clasue_cons, support_goals, accreditation_type, ...rest } = formValues.form1;
    setLoadingState({ action: 'accept', isLoading: true });
    accept({
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: supervisor_id,
        action: 'accept',
        message: 'تم قبول المشروع من قبل مشرف المشاريع ',
        notes: data.notes,
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
      new_values: {
        inner_status: 'ACCEPTED_BY_SUPERVISOR',
        outter_status: 'ONGOING',
        state: 'PROJECT_MANAGER',
        number_of_payments: formValues.form1.number_of_payments,
      },
      proposal_id,
      supervisor_form: {
        ...rest,
        id: nanoid(),
        proposal_id,
        user_id: organizationId,
        // ...data,
      },
      consultant_form: {
        ...consultantForm,
        recommended_support: {
          data: data.recommended_support.map((item: any, index: any) => ({
            clause: item.clause,
            amount: item.amount,
            explanation: item.explanation,
            id: nanoid(),
          })),
        },
        clause: clasue_cons,
        proposal_id,
        supervisor_id,
        id: nanoid(),
      },
    }).then((res) => {
      setLoadingState({ action: 'accept', isLoading: false });
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
      }
    });
  };
  const stepBackProposal = () => {
    stepBack({
      proposal_id,
      new_values: {
        inner_status: 'CREATED_BY_CLIENT',
        outter_status: 'ONGOING',
        state: 'MODERATOR',
        supervisor_id: null,
        project_track: null,
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar('تم إرجاع المعاملة لمسوؤل الفرز بنجاح', {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
      }
    });
  };

  const rejectProject = (values: any) => {
    setLoadingState({ action: 'reject', isLoading: true });
    reject({
      proposal_id,
      new_values: {
        inner_status: 'REJECTED_BY_SUPERVISOR',
        outter_status: 'CANCELED',
        state: 'PROJECT_SUPERVISOR',
      },
      log: {
        id: nanoid(),
        proposal_id,
        reviewer_id: user?.id!,
        action: 'reject',
        message: 'تم رفض المشروع من قبل مشرف المشاريع',
        notes: values.notes,
        user_role: 'PROJECT_SUPERVISOR',
        state: 'PROJECT_SUPERVISOR',
      },
    }).then((res) => {
      setLoadingState({ action: 'reject', isLoading: false });
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      } else {
        enqueueSnackbar(translate('proposal_accept'), {
          variant: 'success',
        });
        navigate(`/project-supervisor/dashboard/app`);
      }
    });
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
                disabled={true}
              >
                {translate('partner_details.send_messages')}
              </Button>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                endIcon={<Iconify icon="eva:edit-2-outline" />}
                onClick={handleClick}
                sx={{
                  flex: 1,
                  backgroundColor: '#0169DE',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
              >
                {translate('partner_details.submit_amendment_request')}
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled={true}>ارسال طلب تعديل الى المشرف</MenuItem>
                <MenuItem onClick={stepBackProposal}>ارجاع المعاملة الى مسؤول الفرز</MenuItem>
              </Menu>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* {action === 'reject' && (
        <ProposalRejectingForm
          onSubmit={(data: any) => {
            console.log(data);
          }}
        />
      )} */}
      <ModalDialog
        maxWidth="md"
        title={
          action === 'accept'
            ? step === 0
              ? 'قبول المشروع'
              : 'البيانات التي تعرض على لجنة المنح'
            : action === 'reject'
            ? 'رفض المشروع'
            : ''
        }
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
            {action === 'reject' && (
              <ProposalRejectingForm onSubmit={rejectProject}>
                <ActionBox
                  action="reject"
                  isLoading={false}
                  onReturn={handleCloseModal}
                  step={step}
                  onBack={onBack}
                />
              </ProposalRejectingForm>
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

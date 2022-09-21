import { useEffect, useState } from 'react';
import { Step, StepLabel, Typography, Stepper, Box, alpha, Container } from '@mui/material';
import useResponsive from 'hooks/useResponsive';
import {
  MainInfoForm,
  ProjectInfoForm,
  ConnectingInfoForm,
  SupportingDurationInfoForm,
  ProjectBudgetForm,
} from './forms';
import useLocales from 'hooks/useLocales';
import ActionBox from './forms/ActionBox';
import { CustomFile } from 'components/upload';
import { useMutation } from 'urql';
import { CreateProposel } from 'queries/client/createProposel';

type FormValuesProps = {
  form1: {
    project_name: string;
    project_idea: string;
    project_location: string;
    project_implement_date: string;
    execution_time: string;
    target_group_type: string;
    letter_ofsupport_req: CustomFile | string | null;
    project_attachments: CustomFile | string | null;
  };
  form2: {
    num_ofproject_binicficiaries: number;
    project_goals: string;
    project_outputs: string;
    project_strengths: string;
    project_risks: string;
  };
  form3: {
    pm_name: string;
    pm_mobile: number;
    pm_email: string;
    region: string;
    governorate: string;
  };
  form4: {
    amount_required_fsupport: number;
    detail_project_budget: {
      item: string;
      explanation: string;
      amount: number;
    }[];
  };
  form5: { need_consultant: boolean };
};

const steps = [
  'funding_project_request_form1.step',
  'funding_project_request_form2.step',
  'funding_project_request_form3.step',
  'funding_project_request_form4.step',
  'funding_project_request_form5.step',
];
const FundingProjectRequestForm = () => {
  const { translate } = useLocales();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultValues = {
    form1: {
      project_name: '',
      project_idea: '',
      project_location: '',
      project_implement_date: '',
      execution_time: '',
      target_group_type: '',
      letter_ofsupport_req: undefined,
      project_attachments: undefined,
    },
    form2: {
      num_ofproject_binicficiaries: undefined,
      project_goals: '',
      project_outputs: '',
      project_strengths: '',
      project_risks: '',
    },
    form3: { pm_name: '', pm_mobile: '', pm_email: '', region: '', governorate: '' },
    form4: {
      amount_required_fsupport: undefined,
      detail_project_budget: [
        {
          item: '',
          explanation: '',
          amount: undefined,
        },
      ],
    },
    form5: { need_consultant: false },
  };
  const [requestState, setRequestState] = useState(defaultValues);
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);

  const [updateTodoResult, updateTodo] = useMutation(CreateProposel);

  const onSubmitform1 = (data: any) => {
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form1: {
        ...prevRegisterState.form1,
        ...data,
      },
    }));
  };
  const onSubmitform2 = (data: any) => {
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form2: {
        ...prevRegisterState.form2,
        ...data,
      },
    }));
  };
  const onSubmitform3 = (data: any) => {
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form3: {
        ...prevRegisterState.form3,
        ...data,
      },
    }));
  };
  const onSubmitform4 = (data: any) => {
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form4: {
        ...prevRegisterState.form4,
        ...data,
      },
    }));
  };
  const onSubmit = (data: any) => {
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form5: { ...prevRegisterState.form5, ...data },
    }));
    console.log(requestState);
    const createdProposel = {
      ...requestState.form1,
      ...requestState.form2,
      ...requestState.form3,
      ...requestState.form4,
      ...requestState.form5,
    };
    updateTodo({
      createdProposel,
    });
  };

  const onSavingDraft = () => {
    console.log('in onSavingDraft');
  };
  const onReturn = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };
  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: alpha('#919EAB', 0.16),
          padding: 3,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          mb: 5,
          display: isMobile ? 'none' : 'table-row-group',
        }}
      >
        <Stepper activeStep={step} connector={null}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography
                  sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', fill: 'Solid', fontSize: '16px' }}
                >
                  {translate(label)}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Container
        sx={{
          px: {
            md: '150px',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', fontSize: '16px', mb: '20px' }}
        >
          {translate(steps[step])}
        </Typography>
        {step === 0 && (
          <MainInfoForm onSubmit={onSubmitform1} defaultValues={requestState.form1}>
            <ActionBox onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </MainInfoForm>
        )}
        {step === 1 && (
          <ProjectInfoForm onSubmit={onSubmitform2} defaultValues={requestState.form2}>
            <ActionBox onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </ProjectInfoForm>
        )}
        {step === 2 && (
          <ConnectingInfoForm onSubmit={onSubmitform3} defaultValues={requestState.form3}>
            <ActionBox onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </ConnectingInfoForm>
        )}
        {step === 3 && (
          <ProjectBudgetForm onSubmit={onSubmitform4} defaultValues={requestState.form4}>
            <ActionBox onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </ProjectBudgetForm>
        )}
        {step === 4 && (
          <SupportingDurationInfoForm onSubmit={onSubmit} defaultValues={requestState.form5}>
            <ActionBox lastStep={true} onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </SupportingDurationInfoForm>
        )}
      </Container>
    </>
  );
};

export default FundingProjectRequestForm;

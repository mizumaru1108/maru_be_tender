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
import { useMutation, useQuery } from 'urql';
import { CreateProposel } from 'queries/client/createProposel';
import { nanoid } from 'nanoid';
import { useLocation, useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { getDraftProposal } from 'queries/client/getDraftProposal';
import { updateDraftProposal } from 'queries/client/updateDraftProposal';
import axios from 'axios';

const steps = [
  'funding_project_request_form1.step',
  'funding_project_request_form2.step',
  'funding_project_request_form3.step',
  'funding_project_request_form4.step',
  'funding_project_request_form5.step',
];
const STEP = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];

const FundingProjectRequestForm = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLocales();

  // getting the proposal id if it is exist
  const { state } = location as any;
  const id = state?.id;

  // when the id is undefined, there is no need to fetch any data
  const [result, _] = useQuery({
    query: getDraftProposal,
    variables: { id },
    pause: id === undefined,
  });
  const { fetching, data, error } = result;

  const [, updateDraft] = useMutation(updateDraftProposal);
  const [, createProposal] = useMutation(CreateProposel);

  const defaultValues = {
    form1: {
      project_name: '',
      project_idea: '',
      project_location: '',
      project_implement_date: '',
      execution_time: '',
      project_beneficiaries: '',
      letter_ofsupport_req: { url: '', size: undefined, type: '' },
      project_attachments: { url: '', size: undefined, type: '' },
      project_beneficiaries_specific_type: '',
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
      detail_project_budgets: {
        data: [
          {
            clause: '',
            explanation: '',
            amount: 0,
          },
        ],
      },
    },
    proposal_bank_id: '',
  };

  const [requestState, setRequestState] = useState(defaultValues);
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);

  // on submit for the first step
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

  // on submit for the second step
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

  // on submit for the third step
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

  // on submit for the fourth step
  const onSubmitform4 = (data: any) => {
    console.log(data);
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form4: {
        amount_required_fsupport: data.amount_required_fsupport,
        detail_project_budgets: {
          ...prevRegisterState.form4.detail_project_budgets,
          data: data.detail_project_budgets,
        },
      },
    }));
  };

  // on submit for creating a new project
  const onSubmit = async (data: any) => {
    const { project_beneficiaries_specific_type, ...restData } = requestState.form1;

    console.log(restData);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      proposal_bank_id: data,
    }));
    if (id) {
      const res = await updateDraft({
        id,
        update: {
          ...requestState.form1,
          ...requestState.form2,
          ...requestState.form3,
          amount_required_fsupport: requestState.form4.amount_required_fsupport,
          proposal_item_budgets: requestState.form4.detail_project_budgets,
          proposal_bank_id: data,
          step: 'ZERO',
        },
      });
      if (res.error === undefined) navigate(-1);
    } else {
      const res = await createProposal({
        createdProposel: {
          ...restData,
          ...requestState.form2,
          ...requestState.form3,
          amount_required_fsupport: requestState.form4.amount_required_fsupport,
          proposal_item_budgets: requestState.form4.detail_project_budgets,
          proposal_bank_id: data,
          submitter_user_id: user?.id,
          id: nanoid(),
          step: 'ZERO',
        },
      });
      if (res.error === undefined) navigate(-1);
    }
  };

  // on saving function and also update a draft one
  const onSavingDraft = async () => {
    const createdProposel = {
      ...(step >= 1 && { ...requestState.form1 }),
      ...(step >= 2 && { ...requestState.form2 }),
      ...(step >= 3 && { ...requestState.form3 }),
      ...(step >= 4 && {
        amount_required_fsupport: requestState.form4.amount_required_fsupport,
        proposal_item_budgets: requestState.form4.detail_project_budgets,
      }),
      // no need to save the proposal_bank_informations
      submitter_user_id: user?.id,
      id: nanoid(),
      step: STEP[step - 1],
    };
    if (id) {
      const res = axios.post(
        'https://api-staging.tmra.io/v2/raise/tender-proposal/update-draft',
        {
          ...(step >= 1 && { form: requestState.form1 }),
          ...(step >= 2 && { form2: requestState.form2 }),
          ...(step >= 3 && { form3: requestState.form3 }),
          ...(step >= 4 && {
            amount_required_fsupport: requestState.form4.amount_required_fsupport,
            proposal_item_budgets: requestState.form4.detail_project_budgets,
          }),
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log(res);
      // const res = await updateDraft({
      //   id,
      //   update: createdProposel,
      // });
      // if (res.error === undefined) navigate(-1);
    } else {
      const res = await createProposal({
        createdProposel,
      });
      if (res.error === undefined) navigate(-1);
    }
  };

  // on return
  const onReturn = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  // useEffect is responible for fetching the data when we are on a Draft project
  useEffect(() => {
    window.scrollTo(0, 0);
    const tuningTheState = () => {
      if (data?.proposal_by_pk) {
        const STEP = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
        const {
          project_name,
          project_idea,
          project_location,
          project_implement_date,
          execution_time,
          project_beneficiaries,
          letter_ofsupport_req,
          project_attachments,
          num_ofproject_binicficiaries,
          project_goals,
          project_outputs,
          project_strengths,
          project_risks,
          pm_name,
          pm_mobile,
          pm_email,
          region,
          governorate,
          amount_required_fsupport,
          proposal_item_budgets,
          step,
        } = data.proposal_by_pk;
        setRequestState((prevRegisterState: any) => ({
          ...prevRegisterState,
          form1: {
            ...prevRegisterState.form1,
            ...{
              project_name: project_name.trim(),
              project_idea,
              project_location,
              project_implement_date,
              execution_time: execution_time.trim(),
              project_beneficiaries,
              letter_ofsupport_req: {
                size: undefined,
                url: letter_ofsupport_req,
                type: 'image/jpeg',
              },
              project_attachments: {
                size: undefined,
                url: project_attachments,
                type: 'image/jpeg',
              },
            },
          },
          form2: {
            ...prevRegisterState.form2,
            ...(STEP.indexOf(step.trim()) >= 1 && {
              num_ofproject_binicficiaries,
              project_goals,
              project_outputs,
              project_strengths,
              project_risks,
            }),
          },
          form3: {
            ...prevRegisterState.form3,
            ...(STEP.indexOf(step.trim()) >= 2 && {
              pm_name: pm_name.trim(),
              pm_mobile: pm_mobile.trim(),
              pm_email: pm_email.trim(),
              region: region.trim(),
              governorate,
            }),
          },
          form4: {
            ...prevRegisterState.form4,
            ...(STEP.indexOf(step.trim()) >= 3 && {
              amount_required_fsupport,
              detail_project_budgets: {
                data: proposal_item_budgets.map((item: any, index: any) => ({
                  amount: item.amount,
                  clause: item.clause.trim(),
                  explanation: item.explanation.trim(),
                })),
              },
            }),
          },
        }));
        setStep(STEP.indexOf(step.trim()));
      }
    };
    tuningTheState();
  }, [data]);
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
          <MainInfoForm onSubmit={onSubmitform1} defaultValues={requestState?.form1}>
            <ActionBox step={step} onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </MainInfoForm>
        )}
        {step === 1 && (
          <ProjectInfoForm onSubmit={onSubmitform2} defaultValues={requestState?.form2}>
            <ActionBox step={step} onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </ProjectInfoForm>
        )}
        {step === 2 && (
          <ConnectingInfoForm onSubmit={onSubmitform3} defaultValues={requestState?.form3}>
            <ActionBox step={step} onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </ConnectingInfoForm>
        )}
        {step === 3 && (
          <ProjectBudgetForm onSubmit={onSubmitform4} defaultValues={requestState?.form4}>
            <ActionBox step={step} onReturn={onReturn} onSavingDraft={onSavingDraft} />
          </ProjectBudgetForm>
        )}
        {step === 4 && (
          <SupportingDurationInfoForm
            step={step}
            lastStep={true}
            onReturn={onReturn}
            onSavingDraft={onSavingDraft}
            onSubmit={onSubmit}
            defaultValues={requestState?.proposal_bank_id}
          >
            <ActionBox
              step={step}
              lastStep={true}
              onReturn={onReturn}
              onSavingDraft={onSavingDraft}
            />
          </SupportingDurationInfoForm>
        )}
      </Container>
    </>
  );
};

export default FundingProjectRequestForm;

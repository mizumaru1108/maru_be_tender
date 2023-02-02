import { alpha, Box, Container, Step, StepLabel, Stepper, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useResponsive from 'hooks/useResponsive';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { CreateProposel } from 'queries/client/createProposel';
import { getDraftProposal } from 'queries/client/getDraftProposal';
import { updateDraftProposal } from 'queries/client/updateDraftProposal';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'urql';
import axiosInstance from 'utils/axios';
import {
  ConnectingInfoForm,
  MainInfoForm,
  ProjectBudgetForm,
  ProjectInfoForm,
  SupportingDurationInfoForm,
} from './forms';
import ActionBox from './forms/ActionBox';

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
  const { user, activeRole } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

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
      execution_time: 0,
      project_beneficiaries: '',
      letter_ofsupport_req: {
        url: '',
        size: undefined,
        type: '',
        base64Data: '',
        fileExtension: '',
        fullName: '',
      },
      project_attachments: {
        url: '',
        size: undefined,
        type: '',
        base64Data: '',
        fileExtension: '',
        fullName: '',
      },
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);
  const [tempValues, setTempValues] = useState({});

  // on submit for the first step
  const onSubmitform1 = (data: any) => {
    // console.log('data form 1', data);
    setIsLoading(false);
    const newData = { ...data };
    const newExTime = Number(data.execution_time);
    newData.execution_time = String(newExTime * 60);
    if (isDraft) {
      onSavingDraft(newData);
    } else {
      setStep((prevStep) => prevStep + 1);
      setRequestState((prevRegisterState: any) => ({
        ...prevRegisterState,
        form1: {
          ...newData,
        },
      }));
    }
  };

  // on submit for the second step
  const onSubmitform2 = (data: any) => {
    if (isDraft) {
      onSavingDraft(data);
    } else {
      setStep((prevStep) => prevStep + 1);
      setRequestState((prevRegisterState: any) => ({
        ...prevRegisterState,
        form2: {
          ...prevRegisterState.form2,
          ...data,
        },
      }));
    }
  };

  // on submit for the third step
  const onSubmitform3 = (data: any) => {
    // console.log('data form 3', data);
    if (isDraft) {
      onSavingDraft(data);
    } else {
      setStep((prevStep) => prevStep + 1);
      setRequestState((prevRegisterState: any) => ({
        ...prevRegisterState,
        form3: {
          ...prevRegisterState.form3,
          ...data,
        },
      }));
    }
  };

  // on submit for the fourth step
  const onSubmitform4 = (data: any) => {
    let newValue = { ...data };
    newValue = {
      ...newValue,
      amount_required_fsupport: data.amount_required_fsupport,
      detail_project_budgets: {
        ...requestState.form4.detail_project_budgets,
        data: data.detail_project_budgets,
      },
    };
    // console.log(data);
    if (isDraft) {
      onSavingDraft(newValue);
    } else {
      setStep((prevStep) => prevStep + 1);
      setRequestState((prevRegisterState: any) => ({
        ...prevRegisterState,
        form4: {
          ...newValue,
        },
      }));
    }
  };

  // on submit for creating a new project
  const onSubmit = async (data: any) => {
    // console.log({ data });
    setIsLoading(true);
    const createdProposel = {
      ...(step >= 1 && { ...requestState.form1 }),
      ...(step >= 2 && { ...requestState.form2 }),
      ...(step >= 3 && { ...requestState.form3 }),
      ...(step >= 4 && {
        amount_required_fsupport: requestState.form4.amount_required_fsupport,
        detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
      }),
      // no need to save the proposal_bank_informations
      submitter_user_id: user?.id,
      proposal_bank_id: data,
      id: nanoid(),
      step: STEP[step - 1],
    };
    // console.log({ createdProposel });
    try {
      const rest = await axiosInstance.post(
        'tender-proposal/create',
        {
          ...createdProposel,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      // setIsLoading(false);
      // console.log({ rest });
      if (rest) {
        const spreadUrl = location.pathname.split('/');
        // history.push('/dashboard');
        navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/app`);
      } else {
        setIsLoading(false);
        alert('Something went wrong');
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }

    // // const { project_beneficiaries_specific_type, ...restData } = requestState.form1;

    // setRequestState((prevRegisterState: any) => ({
    //   ...prevRegisterState,
    //   proposal_bank_id: data,
    // }));
    // if (id) {
    //   const res = await updateDraft({
    //     id,
    //     update: {
    //       ...requestState.form1,
    //       ...requestState.form2,
    //       ...requestState.form3,
    //       amount_required_fsupport: requestState.form4.amount_required_fsupport,
    //       proposal_item_budgets: requestState.form4.detail_project_budgets,
    //       proposal_bank_id: data,
    //       step: 'ZERO',
    //     },
    //   });
    //   if (res.error === undefined) navigate('/client/dashboard/app');
    // } else {
    //   const res = await createProposal({
    //     createdProposel: {
    //       ...restData,
    //       ...requestState.form2,
    //       ...requestState.form3,
    //       amount_required_fsupport: requestState.form4.amount_required_fsupport,
    //       proposal_item_budgets: requestState.form4.detail_project_budgets,
    //       proposal_bank_id: data,
    //       submitter_user_id: user?.id,
    //       id: nanoid(),
    //       step: 'ZERO',
    //     },
    //   });
    //   if (res.error === undefined) navigate('/client/dashboard/app');
    // }
  };

  // on saving function and also update a draft one
  const onSavingDraft = async (data: any) => {
    // console.log('data', data);
    // console.log({ requestState });
    setIsLoading(true);
    const proposalPayload = {
      ...(lastIndex >= 0 && { ...requestState.form1 }),
      ...(lastIndex >= 1 && { ...requestState.form2 }),
      ...(lastIndex >= 2 && { ...requestState.form3 }),
      ...(lastIndex >= 3 && {
        // ...requestState.form4,
        amount_required_fsupport: requestState.form4.amount_required_fsupport,
        detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
      }),
      ...(lastIndex < step && step >= 1 && { ...requestState.form1 }),
      ...(lastIndex < step && step >= 2 && { ...requestState.form2 }),
      ...(lastIndex < step && step >= 3 && { ...requestState.form3 }),
      ...(lastIndex < step &&
        step >= 4 && {
          // ...requestState.form4,
          amount_required_fsupport: requestState.form4.amount_required_fsupport,
          detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
        }),
      // ...data,
      ...(step !== 3 && step !== 4
        ? { ...data }
        : step === 3
        ? {
            amount_required_fsupport: data.amount_required_fsupport,
            detail_project_budgets: [...data.detail_project_budgets.data],
          }
        : { ...data }),
      // no need to save the proposal_bank_informations
      submitter_user_id: user?.id,
      id: nanoid(),
    };
    // console.log({ proposalPayload });
    // console.log({ tempValues });
    // console.log({ requestState });
    const newAttachment = {
      ...(lastIndex === step &&
      step >= 0 &&
      requestState &&
      requestState.form1 &&
      requestState.form1.project_attachments &&
      data &&
      data.project_attachments &&
      requestState.form1.project_attachments.url !== data.project_attachments.url
        ? {
            base64Data: data.project_attachments.base64Data,
            fileExtension: data.project_attachments.fileExtension,
            fullName: data.project_attachments.fullName,
            size: data.project_attachments.size,
          }
        : {}),
    };
    const newLetteSupport = {
      ...(lastIndex === step &&
      step >= 0 &&
      requestState &&
      requestState.form1 &&
      requestState.form1.project_attachments &&
      data &&
      data.project_attachments &&
      requestState.form1.letter_ofsupport_req.url !== data.letter_ofsupport_req.url
        ? {
            base64Data: data.letter_ofsupport_req.base64Data,
            fileExtension: data.letter_ofsupport_req.fileExtension,
            fullName: data.letter_ofsupport_req.fullName,
            size: data.letter_ofsupport_req.size,
          }
        : {}),
    };
    if (!!id) {
      const res = await axiosInstance.patch(
        '/tender-proposal/save-draft',
        {
          ...(lastIndex >= 0 && { ...requestState.form1 }),
          ...(lastIndex >= 1 && { ...requestState.form2 }),
          ...(lastIndex >= 2 && { ...requestState.form3 }),
          ...(lastIndex >= 3 && {
            // ...requestState.form4,
            amount_required_fsupport: requestState.form4.amount_required_fsupport,
            detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
          }),
          ...(lastIndex === step && step >= 0
            ? {
                ...data,
                project_attachments: {
                  ...(!!newAttachment && Object.keys(newAttachment).length > 0
                    ? { ...newAttachment }
                    : { ...data.project_attachments }),
                },
                letter_ofsupport_req: {
                  ...(!!newLetteSupport && Object.keys(newLetteSupport).length > 0
                    ? { ...newLetteSupport }
                    : { ...data.letter_ofsupport_req }),
                },
              }
            : {}),
          ...(lastIndex < step && step >= 0 && { ...requestState.form1 }),
          ...(lastIndex < step && step >= 1 && { ...requestState.form2 }),
          ...(lastIndex < step && step >= 2 && { ...requestState.form3 }),
          ...(lastIndex < step &&
            data &&
            step === 3 && {
              amount_required_fsupport: data.amount_required_fsupport,
              detail_project_budgets: [...data.detail_project_budgets.data],
            }),
          ...(lastIndex > step && step === 0 && data && { ...data }),
          ...(lastIndex > step && step === 1 && data && { ...data }),
          ...(lastIndex > step && step === 2 && data && { ...data }),
          ...(lastIndex > step &&
            data &&
            step === 3 && {
              // ...requestState.form4,
              amount_required_fsupport: data.amount_required_fsupport,
              detail_project_budgets: [...data.detail_project_budgets.data],
            }),
          // ...data,
          ...(step !== 3 && step !== 4
            ? { ...data }
            : step === 3
            ? {
                amount_required_fsupport: data.amount_required_fsupport,
                detail_project_budgets: [...data.detail_project_budgets.data],
              }
            : { ...data }),
          proposal_bank_information_id: step === 4 ? data : undefined,
          proposal_id: id,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      if (res) {
        const spreadUrl = location.pathname.split('/');
        // history.push('/dashboard');
        navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
      } else {
        enqueueSnackbar(translate('Something went wrong'), {
          variant: 'error',
        });
      }
    } else {
      try {
        const rest = await axiosInstance.post(
          'tender-proposal/create',
          {
            ...proposalPayload,
          },
          {
            headers: { 'x-hasura-role': activeRole! },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );
        // setIsLoading(false);
        // console.log({ rest });
        if (rest) {
          const spreadUrl = location.pathname.split('/');
          // history.push('/dashboard');
          navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
        } else {
          setIsLoading(false);
          alert('Something went wrong');
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
  };
  const onLastSavingDraft = async (data: any) => {
    // console.log('data', data);
    setIsLoading(true);
    const res = await axiosInstance.patch(
      '/tender-proposal/save-draft',
      {
        ...(lastIndex >= 0 && { ...requestState.form1 }),
        ...(lastIndex >= 1 && { ...requestState.form2 }),
        ...(lastIndex >= 2 && { ...requestState.form3 }),
        ...(lastIndex >= 3 && {
          // ...requestState.form4,
          amount_required_fsupport: requestState.form4.amount_required_fsupport,
          detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
        }),
        ...(lastIndex < step && step >= 1 && { ...requestState.form1 }),
        ...(lastIndex < step && step >= 2 && { ...requestState.form2 }),
        ...(lastIndex < step && step >= 3 && { ...requestState.form3 }),
        ...(lastIndex < step &&
          step >= 4 && {
            // ...requestState.form4,
            amount_required_fsupport: requestState.form4.amount_required_fsupport,
            detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
          }),
        // ...data,
        proposal_bank_information_id: step === 4 ? data : undefined,
        proposal_id: id,
      },
      {
        headers: { 'x-hasura-role': activeRole! },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );
    if (res) {
      const spreadUrl = location.pathname.split('/');
      // history.push('/dashboard');
      navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
    } else {
      enqueueSnackbar(translate('Something went wrong'), {
        variant: 'error',
      });
    }
  };

  // on return
  const onReturn = () => {
    if (step === 0) {
      navigate('/client/dashboard/draft-funding-requests');
    } else {
      setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    }
  };

  // useEffect is responible for fetching the data when we are on a Draft project
  useEffect(() => {
    window.scrollTo(0, 0);

    if (id) {
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
                execution_time: execution_time,
                project_beneficiaries,
                letter_ofsupport_req: {
                  // size: undefined,
                  // url: letter_ofsupport_req,
                  // type: 'image/jpeg',
                  ...letter_ofsupport_req,
                },
                project_attachments: {
                  // size: undefined,
                  // url: project_attachments,
                  // type: 'image/jpeg',
                  ...project_attachments,
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
          setTempValues((prevTempValues: any) => ({
            ...prevTempValues,
            ...(STEP.indexOf(step.trim()) >= 0 && {
              project_name: project_name.trim(),
              project_idea,
              project_location,
              project_implement_date,
              execution_time: execution_time,
              project_beneficiaries,
              letter_ofsupport_req: {
                // size: undefined,
                // url: letter_ofsupport_req,
                // type: 'image/jpeg',
                ...letter_ofsupport_req,
              },
              project_attachments: {
                // size: undefined,
                // url: project_attachments,
                // type: 'image/jpeg',
                ...project_attachments,
              },
            }),
            ...(STEP.indexOf(step.trim()) >= 1 && {
              num_ofproject_binicficiaries,
              project_goals,
              project_outputs,
              project_strengths,
              project_risks,
            }),
            ...(STEP.indexOf(step.trim()) >= 2 && {
              pm_name: pm_name.trim(),
              pm_mobile: pm_mobile.trim(),
              pm_email: pm_email.trim(),
              region: region.trim(),
              governorate,
            }),
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
          }));
          setStep(STEP.indexOf(step.trim()));
          setLastIndex(STEP.indexOf(step.trim()));
        }
      };
      tuningTheState();
    }
  }, [data, id]);
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
          variant="h5"
          sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', fontSize: '16px', mb: '20px' }}
        >
          {translate(steps[step])}
        </Typography>
        {step === 0 && (
          <MainInfoForm onSubmit={onSubmitform1} defaultValues={requestState?.form1}>
            <ActionBox
              step={step}
              onReturn={onReturn}
              isLoad={isLoading}
              // onSavingDraft={onSavingDraft}
              isStep={step < 5}
              isDraft={(draft: boolean) => setIsDraft(draft)}
            />
          </MainInfoForm>
        )}
        {step === 1 && (
          <ProjectInfoForm onSubmit={onSubmitform2} defaultValues={requestState?.form2}>
            <ActionBox
              step={step}
              onReturn={onReturn}
              isLoad={isLoading}
              // onSavingDraft={onSavingDraft}
              isStep={id !== undefined ? true : false}
              isDraft={(draft: boolean) => setIsDraft(draft)}
            />
          </ProjectInfoForm>
        )}
        {step === 2 && (
          <ConnectingInfoForm onSubmit={onSubmitform3} defaultValues={requestState?.form3}>
            <ActionBox
              step={step}
              onReturn={onReturn}
              isLoad={isLoading}
              // onSavingDraft={onSavingDraft}
              isStep={id !== undefined ? true : false}
              isDraft={(draft: boolean) => setIsDraft(draft)}
            />
          </ConnectingInfoForm>
        )}
        {step === 3 && (
          <ProjectBudgetForm onSubmit={onSubmitform4} defaultValues={requestState?.form4}>
            <ActionBox
              step={step}
              onReturn={onReturn}
              isLoad={isLoading}
              // onSavingDraft={onSavingDraft}
              isStep={id !== undefined ? true : false}
              isDraft={(draft: boolean) => setIsDraft(draft)}
            />
          </ProjectBudgetForm>
        )}
        {step === 4 && (
          <SupportingDurationInfoForm
            lastStep={true}
            onReturn={onReturn}
            onUpdate={(data: any) => {
              onLastSavingDraft(data);
            }}
            // onSavingDraft={onSavingDraft}
            proposal_id={id}
            onSubmit={onSubmit}
            onLoader={(load) => setIsLoading(load)}
            isLoading={isLoading}
            defaultValues={requestState?.proposal_bank_id}
          >
            {/* <ActionBox
                step={step}
                lastStep={true}
                onReturn={onReturn}
                onSavingDraft={onSavingDraft}
                setLoader={(load) => setIsLoading(load)}
                isLoading={isLoading}
              /> */}
          </SupportingDurationInfoForm>
        )}
      </Container>
    </>
  );
};

export default FundingProjectRequestForm;

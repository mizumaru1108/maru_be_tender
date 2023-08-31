import { async } from '@firebase/util';
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
import ProjectTimeLine from 'sections/client/funding-project-request/forms/ProjectTimeLine';
import { useMutation, useQuery } from 'urql';
import axiosInstance from 'utils/axios';
import { AmandementFields, AmandmentRequestForm } from '../../../../@types/proposal';
import Toast from '../../../../components/toast';
import {
  ConnectingInfoForm,
  MainInfoForm,
  ProjectBudgetForm,
  ProjectInfoForm,
  SupportingDurationInfoForm,
} from '../forms';
import ActionBox from '../forms/ActionBox';
import ProposalBankInformation from '../forms/ProposalBankInformation';
import AmandementActionBox from './AmandementActionBox';

const steps = [
  'funding_project_request_form1.step',
  'funding_project_request_form2.step',
  'funding_project_request_form3.step',
  'funding_project_request_form4.step',
  'funding_project_request_project_timeline.step',
  'funding_project_request_bank_information.step',
  // 'funding_project_request_form5.step',
];
// const STEP = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];

type ITmpValues = {
  data: AmandmentRequestForm;
  revised: AmandementFields;
};
type Props = {
  tmpValues?: ITmpValues;
};
const AmandementClientForm = ({ tmpValues }: Props) => {
  const location = useLocation();
  const { user, activeRole } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  // console.log('tmpValues', tmpValues);

  // getting the proposal id if it is exist
  const { state } = location as any;

  const defaultValues = {
    project_timeline: [
      {
        name: '',
        start_date: '',
        end_date: '',
      },
    ],
    form1: {
      project_name: '',
      project_idea: '',
      project_location: '',
      project_implement_date: '',
      execution_time: 0,
      project_beneficiaries: '',
      beneficiary_id: '',
      letter_ofsupport_req: {
        url: '',
        size: undefined,
        type: '',
        base64Data: '',
        fileExtension: '',
        fullName: '',
        file: undefined,
      },
      project_attachments: {
        url: '',
        size: undefined,
        type: '',
        base64Data: '',
        fileExtension: '',
        fullName: '',
        file: undefined,
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
    form3: {
      pm_name: '',
      pm_mobile: '',
      pm_email: '',
      region: '',
      governorate: '',
      region_id: '',
      governorate_id: '',
    },
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

  // const [openToast, setOpenToast] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
  });
  const [requestState, setRequestState] = useState(defaultValues);
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [tempValues, setTempValues] = useState({});

  // on submit for the first step
  const onSubmitform1 = (data: any) => {
    // console.log('data form 1', data);
    // setIsLoading(false);
    const newData = { ...data };
    const newExTime = Number(data.execution_time);
    newData.execution_time = newExTime * 60;
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form1: {
        ...newData,
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
    // console.log('data form 3', data);
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
    // console.log('data form 4', data);
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      form4: {
        // ...prevRegisterState.form4,
        // ...data,
        amount_required_fsupport: String(data.amount_required_fsupport),
        detail_project_budgets: [...data.detail_project_budgets],
      },
    }));
  };

  // on submit for the Fifth step
  const onSubmitform5 = (data: any) => {
    // console.log('data form 5', data);
    setStep((prevStep) => prevStep + 1);
    setRequestState((prevRegisterState: any) => ({
      ...prevRegisterState,
      project_timeline: [...data?.project_timeline],
    }));
  };
  const onSubmitform6 = async (data: any) => {
    // console.log('data form 5', data.project_timeline);
    setIsLoading(true);
    let newValue: any = {};
    newValue = {
      ...newValue,
      ...requestState.form1,
      ...requestState.form2,
      ...requestState.form3,
      ...requestState.form4,
      proposal_bank_id: data.proposal_bank_id,
      // timelines: data.project_timeline,
    };
    // console.log('newValue', newValue);
    delete newValue.project_attachments;
    delete newValue.letter_ofsupport_req;
    delete newValue.project_timeline;
    // delete newValue.detail_project_budgets;

    let filteredValue = Object.keys(newValue)
      .filter((key) => Object.keys(tmpValues?.revised!).includes(key))
      .reduce((obj: any, key: any) => {
        obj[key] = newValue[key];
        return obj;
      }, {});

    filteredValue = {
      ...filteredValue,
      proposal_id: tmpValues?.data.id,
    };

    if (tmpValues?.revised.hasOwnProperty('amount_required_fsupport')) {
      // filteredValue = {
      //   ...filteredValue,
      //   detail_project_budgets: requestState.form4.detail_project_budgets,
      // };
      filteredValue.amount_required_fsupport = requestState.form4.amount_required_fsupport;
    }
    let formData = new FormData();
    for (const key in filteredValue) {
      formData.append(key, filteredValue[key]);
    }
    // console.log({ requestState });
    if (tmpValues?.revised.hasOwnProperty('amount_required_fsupport')) {
      const tmpBudget: any = requestState.form4.detail_project_budgets;
      if (tmpBudget.data && tmpBudget.data.length > 0) {
        for (let i = 0; i < requestState.form4.detail_project_budgets.data.length; i++) {
          const budget: {
            amount: number;
            explanation: string;
            clause: string;
          } = requestState.form4.detail_project_budgets.data[i];
          const index = i; // Get the index for appending to FormData
          formData.append(`detail_project_budgets[${index}][amount]`, budget.amount as any);
          formData.append(`detail_project_budgets[${index}][explanation]`, budget.explanation);
          formData.append(`detail_project_budgets[${index}][clause]`, budget.clause);
        }
      } else {
        if (tmpBudget && tmpBudget.length > 0) {
          for (let i = 0; i < tmpBudget.length; i++) {
            const budget: {
              amount: number;
              explanation: string;
              clause: string;
            } = tmpBudget[i];
            const index = i; // Get the index for appending to FormData
            formData.append(`detail_project_budgets[${index}][amount]`, budget.amount as any);
            formData.append(`detail_project_budgets[${index}][explanation]`, budget.explanation);
            formData.append(`detail_project_budgets[${index}][clause]`, budget.clause);
          }
        }
      }
    }
    if (
      (tmpValues?.revised.hasOwnProperty('project_timeline') ||
        tmpValues?.revised.hasOwnProperty('timelines')) &&
      requestState?.project_timeline.length > 0
    ) {
      for (let i = 0; i < requestState?.project_timeline.length; i++) {
        const timeline: {
          name: string;
          start_date: string;
          end_date: string;
        } = requestState?.project_timeline[i];
        // console.log('masuk sini', data?.project_timeline[i]);
        const index = i; // Get the index for appending to FormData
        // Append the values for each object using template literals
        formData.append(`project_timeline[${index}][name]`, timeline.name);
        formData.append(`project_timeline[${index}][start_date]`, timeline.start_date);
        formData.append(`project_timeline[${index}][end_date]`, timeline.end_date);
      }
    }
    if (tmpValues?.revised.hasOwnProperty('project_attachments')) {
      // console.log('masuk sini attachment', requestState?.form1);
      if (requestState?.form1?.project_attachments?.file) {
        formData.append(
          'project_attachments',
          requestState?.form1?.project_attachments?.file[0] as Blob
        );
      } else {
        formData.append(
          'project_attachments[url]',
          requestState?.form1?.project_attachments?.url as string
        );
        formData.append(
          'project_attachments[type]',
          requestState?.form1?.project_attachments?.type as string
        );
        formData.append(
          'project_attachments[size]',
          requestState?.form1?.project_attachments?.size as any
        );
      }
    }
    if (tmpValues?.revised.hasOwnProperty('letter_ofsupport_req')) {
      // console.log('masuk sini letter', requestState?.form1?.letter_ofsupport_req);
      if (requestState?.form1?.letter_ofsupport_req?.file) {
        formData.append(
          'letter_ofsupport_req',
          requestState?.form1?.letter_ofsupport_req?.file[0] as Blob
        );
      } else {
        formData.append(
          'letter_ofsupport_req[url]',
          requestState?.form1?.letter_ofsupport_req?.url as string
        );
        formData.append(
          'letter_ofsupport_req[type]',
          requestState?.form1?.letter_ofsupport_req?.type as string
        );
        formData.append(
          'letter_ofsupport_req[size]',
          requestState?.form1?.letter_ofsupport_req?.size as any
        );
      }
    }
    // console.log('test', formData.get('proposal_id'));
    // console.log('test', formData.getAll('proposal_id'));
    // if (tmpValues?.revised.hasOwnProperty('project_timeline')) {
    //   delete filteredValue.project_timeline;
    //   filteredValue = {
    //     ...filteredValue,
    //     project_timeline: data.project_timeline,
    //   };
    // }
    // console.log({ filteredValue });

    try {
      const url = '/tender-proposal/send-revision-cqrs';
      //  const url = '/tender-proposal/send-revision';
      const rest = await axiosInstance.patch(url, formData, {
        headers: { 'x-hasura-role': activeRole! },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      if (rest) {
        const spreadUrl = location.pathname.split('/');
        enqueueSnackbar(translate('proposal_created'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
        navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/app`);
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    // window.scrollTo(0, 0);

    if (tmpValues) {
      const tuningTheState = () => {
        if (tmpValues.data) {
          setRequestState((prevRegisterState: any) => ({
            ...prevRegisterState,
            proposal_bank_id: tmpValues?.data?.proposal_bank_id,
            project_timeline: tmpValues?.data?.project_timeline || [],
            form1: {
              ...prevRegisterState.form1,
              ...{
                project_name: tmpValues?.data.project_name,
                project_idea: tmpValues?.data.project_idea,
                project_location: tmpValues?.data.project_location,
                project_implement_date: tmpValues?.data.project_implement_date,
                execution_time: tmpValues?.data.execution_time,
                project_beneficiaries: tmpValues?.data.project_beneficiaries,
                beneficiary_id: tmpValues?.data?.beneficiary_id,
                letter_ofsupport_req: {
                  ...tmpValues?.data.letter_ofsupport_req,
                },
                project_attachments: {
                  ...tmpValues?.data.project_attachments,
                },
              },
            },
            form2: {
              ...prevRegisterState.form2,
              ...{
                num_ofproject_binicficiaries: tmpValues?.data.num_ofproject_binicficiaries,
                project_goals: tmpValues?.data.project_goals,
                project_outputs: tmpValues?.data.project_outputs,
                project_strengths: tmpValues?.data.project_strengths,
                project_risks: tmpValues?.data.project_risks,
              },
            },
            form3: {
              ...prevRegisterState.form3,
              ...{
                pm_name: tmpValues?.data.pm_name,
                pm_mobile: tmpValues?.data.pm_mobile,
                pm_email: tmpValues?.data.pm_email,
                region: tmpValues?.data.region,
                governorate: tmpValues?.data.governorate,
                region_id: tmpValues?.data.region_id,
                governorate_id: tmpValues?.data.governorate_id,
              },
            },
            form4: {
              ...prevRegisterState.form4,
              ...{
                amount_required_fsupport: tmpValues?.data.amount_required_fsupport,
                detail_project_budgets: {
                  data: tmpValues?.data.proposal_item_budgets.map((item: any, index: any) => ({
                    amount: item.amount,
                    clause: item.clause.trim(),
                    explanation: item.explanation.trim(),
                  })),
                },
              },
            },
          }));
        }
      };
      tuningTheState();
    }
  }, [tmpValues]);
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
          py: 'auto',
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
          <MainInfoForm
            onSubmit={onSubmitform1}
            defaultValues={requestState?.form1}
            revised={tmpValues?.revised}
          >
            <AmandementActionBox step={step} onReturn={onReturn} isLoad={isLoading} />
          </MainInfoForm>
        )}
        {step === 1 && (
          <ProjectInfoForm
            onSubmit={onSubmitform2}
            defaultValues={requestState?.form2}
            revised={tmpValues?.revised}
          >
            <AmandementActionBox step={step} onReturn={onReturn} isLoad={isLoading} />
          </ProjectInfoForm>
        )}
        {step === 2 && (
          <ConnectingInfoForm
            onSubmit={onSubmitform3}
            defaultValues={requestState?.form3}
            revised={tmpValues?.revised}
          >
            <AmandementActionBox step={step} onReturn={onReturn} isLoad={isLoading} />
          </ConnectingInfoForm>
        )}
        {step === 3 && (
          <ProjectBudgetForm
            onSubmit={onSubmitform4}
            defaultValues={requestState?.form4}
            revised={tmpValues?.revised}
          >
            <AmandementActionBox step={step} onReturn={onReturn} isLoad={isLoading} />
          </ProjectBudgetForm>
        )}
        {step === 4 && (
          <ProjectTimeLine
            onSubmit={onSubmitform5}
            defaultValues={requestState?.project_timeline}
            revised={tmpValues?.revised}
          >
            <AmandementActionBox step={step} onReturn={onReturn} isLoad={isLoading} />
          </ProjectTimeLine>
        )}
        {step === 5 && (
          <ProposalBankInformation
            onSubmit={onSubmitform6}
            defaultValues={{ proposal_bank_id: requestState?.proposal_bank_id }}
            revised={tmpValues?.revised}
            isLoading={isLoading}
          >
            <AmandementActionBox step={step} onReturn={onReturn} isLoad={isLoading} />
          </ProposalBankInformation>
        )}
        <Toast
          variant="outlined"
          toastType={'success'}
          message={toast.message}
          autoHideDuration={2000}
          isOpen={toast.open}
          position="bottom-right"
          onClose={() => {
            setToast({ open: false, message: '' });
          }}
        />
      </Container>
    </>
  );
};

export default AmandementClientForm;

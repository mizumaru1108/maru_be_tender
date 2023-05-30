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
import AmandementActionBox from './AmandementActionBox';

const steps = [
  'funding_project_request_form1.step',
  'funding_project_request_form2.step',
  'funding_project_request_form3.step',
  'funding_project_request_form4.step',
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
  const onSubmitform4 = async (data: any) => {
    // console.log('data form 4', data);
    setIsLoading(true);
    let newValue = { ...data };
    newValue = {
      ...newValue,
      ...requestState.form1,
      ...requestState.form2,
      ...requestState.form3,
      amount_required_fsupport: data.amount_required_fsupport,
    };
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
    if (filteredValue.hasOwnProperty('amount_required_fsupport')) {
      filteredValue = {
        ...filteredValue,
        detail_project_budgets: [...data.detail_project_budgets],
      };
    }

    // console.log({ filteredValue });
    try {
      const rest = await axiosInstance.patch(
        '/tender-proposal/send-revision',
        {
          ...filteredValue,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
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
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
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
            form1: {
              ...prevRegisterState.form1,
              ...{
                project_name: tmpValues?.data.project_name,
                project_idea: tmpValues?.data.project_idea,
                project_location: tmpValues?.data.project_location,
                project_implement_date: tmpValues?.data.project_implement_date,
                execution_time: tmpValues?.data.execution_time,
                project_beneficiaries: tmpValues?.data.project_beneficiaries,
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
        {/* {step === 4 && (
          <SupportingDurationInfoForm
            lastStep={true}
            onReturn={onReturn}
            onUpdate={(data: any) => {
              onLastSavingDraft(data);
            }}
            proposal_id={id}
            onSubmit={onSubmit}
            onLoader={(load) => setIsLoading(load)}
            isLoading={isLoading}
            defaultValues={requestState?.proposal_bank_id}
          ></SupportingDurationInfoForm>
        )} */}
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

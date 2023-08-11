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
import { getBeneficiariesList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import { useMutation, useQuery } from 'urql';
import axiosInstance from 'utils/axios';
import Toast from '../../../components/toast';
import { logUtil } from '../../../utils/log-util';
import { removeEmptyKey } from '../../../utils/remove-empty-key';
import {
  ConnectingInfoForm,
  MainInfoForm,
  ProjectBudgetForm,
  ProjectInfoForm,
  SupportingDurationInfoForm,
} from './forms';
import ActionBox from './forms/ActionBox';
import ProjectTimeLine from './forms/ProjectTimeLine';

const steps = [
  'funding_project_request_form1.step',
  'funding_project_request_form2.step',
  'funding_project_request_form3.step',
  'funding_project_request_form4.step',
  'funding_project_request_project_timeline.step',
  'funding_project_request_form5.step',
];
const STEP = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'];

const FundingProjectRequestForm = () => {
  const location = useLocation();
  const { user, activeRole } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { loadingCount } = useSelector((state) => state.proposal);

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
      // project_beneficiaries: '',
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
      // project_beneficiaries_specific_type: '',
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
    project_timeline: [
      // {
      //   name: '',
      //   start_date: '',
      //   end_date: '',
      // },
    ],
  };

  const [toast, setToast] = useState({
    open: false,
    message: '',
  });
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
    // setIsLoading(false);
    const newData = { ...data };
    const newExTime = Number(data.execution_time);
    newData.execution_time = newExTime * 60;
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
  const onSubmitform5 = (data: any) => {
    let newValue = { project_timeline: data.project_timeline };
    const test = { ...newValue };
    // console.log('test', test.project_timeline);
    if (isDraft) {
      onSavingDraft(test);
    } else {
      setStep((prevStep) => prevStep + 1);
      setRequestState((prevRegisterState: any) => ({
        ...prevRegisterState,
        project_timeline: [...test.project_timeline],
      }));
    }
  };
  // console.log({ requestState });
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
      project_timeline: [...requestState.project_timeline],
      submitter_user_id: user?.id,
      proposal_bank_information_id: data,
    };

    //<for formData>
    const datas = { ...createdProposel };
    let formData = new FormData();
    const payload = removeEmptyKey(createdProposel);
    delete payload.detail_project_budgets;
    delete payload.project_attachments;
    delete payload.letter_ofsupport_req;
    delete payload.project_timeline;
    delete payload.detail_project_budgets;
    const jsonData: any = {
      ...payload,
    };
    for (const key in jsonData) {
      formData.append(key, jsonData[key]);
    }
    if (datas && datas?.detail_project_budgets && datas?.detail_project_budgets?.length > 0) {
      for (let i = 0; i < datas?.detail_project_budgets?.length; i++) {
        const budget = datas?.detail_project_budgets[i];
        const index = i; // Get the index for appending to FormData

        // Append the values for each object using template literals
        formData.append(`detail_project_budgets[${index}][amount]`, budget.amount as any);
        formData.append(`detail_project_budgets[${index}][explanation]`, budget.explanation);
        formData.append(`detail_project_budgets[${index}][clause]`, budget.clause);
      }
    }
    if (datas && datas?.project_timeline && datas?.project_timeline?.length > 0) {
      for (let i = 0; i < datas?.project_timeline?.length; i++) {
        const timeline: {
          name: string;
          start_date: string;
          end_date: string;
        } = datas?.project_timeline[i];
        const index = i; // Get the index for appending to FormData

        // Append the values for each object using template literals
        formData.append(`project_timeline[${index}][name]`, timeline.name);
        formData.append(`project_timeline[${index}][start_date]`, timeline.start_date);
        formData.append(`project_timeline[${index}][end_date]`, timeline.end_date);
      }
    }
    if (datas && datas?.project_attachments && datas?.project_attachments?.file) {
      formData.append('project_attachments', datas?.project_attachments?.file[0] as Blob);
    } else {
      formData.append('project_attachments[url]', datas?.project_attachments?.url as string);
      formData.append('project_attachments[type]', datas?.project_attachments?.type as string);
      formData.append('project_attachments[size]', datas?.project_attachments?.size as any);
    }
    if (datas && datas?.letter_ofsupport_req && datas?.letter_ofsupport_req?.file) {
      formData.append('letter_ofsupport_req', datas?.letter_ofsupport_req?.file[0] as Blob);
    } else {
      formData.append('letter_ofsupport_req[url]', datas?.letter_ofsupport_req?.url as string);
      formData.append('letter_ofsupport_req[type]', datas?.letter_ofsupport_req?.type as string);
      formData.append('letter_ofsupport_req[size]', datas?.letter_ofsupport_req?.size as any);
    }
    // try {
    //   const rest = await axiosInstance.post(
    //     'tender-proposal/create',
    //     {
    //       ...createdProposel,
    //     },
    //     {
    //       headers: { 'x-hasura-role': activeRole! },
    //       maxBodyLength: Infinity,
    //       maxContentLength: Infinity,
    //     }
    //   );
    //   if (rest) {
    //     const spreadUrl = location.pathname.split('/');
    //     enqueueSnackbar(translate('proposal_created'), {
    //       variant: 'success',
    //       preventDuplicate: true,
    //       autoHideDuration: 3000,
    //       anchorOrigin: {
    //         vertical: 'bottom',
    //         horizontal: 'center',
    //       },
    //     });
    //     navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/app`);
    //   } else {
    //     setIsLoading(false);
    //     alert('Something went wrong');
    //   }
    // } catch (err) {
    //   console.log(err);
    //   setIsLoading(false);
    // }

    try {
      const res = await axiosInstance.post('/tender-proposal/interceptor-create', formData, {
        headers: { 'x-hasura-role': activeRole! },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      if (res) {
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
    } finally {
      setIsLoading(false);
      setIsDraft(false);
    }
  };

  const onSavingDraft = async (data: any) => {
    setIsLoading(true);
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
    const proposalContinueDraft = {
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
        step >= 3 && {
          amount_required_fsupport: requestState.form4.amount_required_fsupport,
          detail_project_budgets: requestState.form4.detail_project_budgets.data || [],
        }),
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
      ...(step !== 3 && step !== 4 ? { ...data } : null),
      // ...(step >= 4 && {`
      //   amount_required_fsupport: requestState.form4.amount_required_fsupport,
      //   detail_project_budgets: requestState.form4.detail_project_budgets || [],
      // }),
      project_timeline:
        data && data.project_timeline
          ? [...data.project_timeline]
          : [...requestState.project_timeline],
      proposal_bank_information_id: step === 5 ? data : undefined,
      proposal_id: id,
    };
    // FormData
    const formData = new FormData();
    const datas = { ...proposalContinueDraft };
    const payload = removeEmptyKey(proposalContinueDraft);
    delete payload.detail_project_budgets;
    delete payload.project_attachments;
    delete payload.letter_ofsupport_req;
    delete payload.detail_project_budgets;
    delete payload.project_timeline;
    const jsonData: any = {
      ...payload,
    };
    console.log({ datas });
    for (const key in jsonData) {
      formData.append(key, jsonData[key]);
    }
    if (datas && datas?.detail_project_budgets && datas?.detail_project_budgets?.length > 0) {
      for (let i = 0; i < datas?.detail_project_budgets?.length; i++) {
        const budget = datas?.detail_project_budgets[i];
        const index = i; // Get the index for appending to FormData

        // Append the values for each object using template literals
        formData.append(`detail_project_budgets[${index}][amount]`, budget.amount as any);
        formData.append(`detail_project_budgets[${index}][explanation]`, budget.explanation);
        formData.append(`detail_project_budgets[${index}][clause]`, budget.clause);
      }
    }
    if (datas && datas?.project_timeline && datas?.project_timeline?.length > 0) {
      for (let i = 0; i < datas?.project_timeline?.length; i++) {
        const timeline: {
          name: string;
          start_date: string;
          end_date: string;
        } = datas?.project_timeline[i];
        const index = i; // Get the index for appending to FormData

        // Append the values for each object using template literals
        formData.append(`project_timeline[${index}][name]`, timeline.name);
        formData.append(`project_timeline[${index}][start_date]`, timeline.start_date);
        formData.append(`project_timeline[${index}][end_date]`, timeline.end_date);
      }
    }
    if (datas && datas?.project_attachments && datas?.project_attachments?.file) {
      // console.log('datas?.project_attachments?.file', datas?.project_attachments?.file);
      formData.append('project_attachments', datas?.project_attachments?.file[0] as Blob);
    } else {
      formData.append('project_attachments[url]', datas?.project_attachments?.url as string);
      formData.append('project_attachments[type]', datas?.project_attachments?.type as string);
      formData.append('project_attachments[size]', datas?.project_attachments?.size as any);
    }
    if (datas && datas?.letter_ofsupport_req && datas?.letter_ofsupport_req?.file) {
      formData.append('letter_ofsupport_req', datas?.letter_ofsupport_req?.file[0] as Blob);
    } else {
      formData.append('letter_ofsupport_req[url]', datas?.letter_ofsupport_req?.url as string);
      formData.append('letter_ofsupport_req[type]', datas?.letter_ofsupport_req?.type as string);
      formData.append('letter_ofsupport_req[size]', datas?.letter_ofsupport_req?.size as any);
    }
    if (!!id) {
      const res = await axiosInstance.patch(
        // witoutFormData
        // '/tender-proposal/save-draft',

        // withFormData
        '/tender-proposal/interceptor-save-draft',
        // { ...datas },
        formData,
        {
          headers: { 'x-hasura-role': activeRole! },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      if (res) {
        const spreadUrl = location.pathname.split('/');
        enqueueSnackbar(translate('proposal_saving_draft'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
        navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
        // setToast({
      } else {
        enqueueSnackbar(translate('Something went wrong'), {
          variant: 'error',
        });
      }
    } else {
      try {
        const rest = await axiosInstance.post(
          // withoutFormData
          // 'tender-proposal/create',
          // {
          //   ...datas,
          // },
          '/tender-proposal/interceptor-create',
          formData,
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
          enqueueSnackbar(translate('proposal_saving_draft'), {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
          navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
        } else {
          setIsLoading(false);
          alert('Something went wrong');
        }
      } catch (err) {
        // console.log(err);
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
      } finally {
        setIsLoading(false);
        setIsDraft(false);
      }
    }
  };
  const onLastSavingDraft = async (data: any) => {
    // console.log('data', data);
    const saveLastDraft = {
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
      // project_timeline: [...requestState.project_timeline],
      project_timeline:
        data && data.project_timeline
          ? [...data.project_timeline]
          : [...requestState.project_timeline],
      proposal_bank_information_id: step === 5 ? data : undefined,
      proposal_id: id,
    };
    const formData = new FormData();
    const datas = { ...saveLastDraft };
    const payload = removeEmptyKey(saveLastDraft);
    delete payload.detail_project_budgets;
    delete payload.project_attachments;
    delete payload.letter_ofsupport_req;
    delete payload.detail_project_budgets;
    delete payload.project_timeline;
    const jsonData: any = {
      ...payload,
    };
    for (const key in jsonData) {
      formData.append(key, jsonData[key]);
    }
    if (datas && datas?.detail_project_budgets && datas?.detail_project_budgets?.length > 0) {
      for (let i = 0; i < datas?.detail_project_budgets?.length; i++) {
        const budget = datas?.detail_project_budgets[i];
        const index = i; // Get the index for appending to FormData

        // Append the values for each object using template literals
        formData.append(`detail_project_budgets[${index}][amount]`, budget.amount as any);
        formData.append(`detail_project_budgets[${index}][explanation]`, budget.explanation);
        formData.append(`detail_project_budgets[${index}][clause]`, budget.clause);
      }
    }
    if (datas && datas?.project_timeline && datas?.project_timeline?.length > 0) {
      for (let i = 0; i < datas?.project_timeline?.length; i++) {
        const timeline: {
          name: string;
          start_date: string;
          end_date: string;
        } = datas?.project_timeline[i];
        const index = i; // Get the index for appending to FormData

        // Append the values for each object using template literals
        formData.append(`project_timeline[${index}][name]`, timeline.name);
        formData.append(`project_timeline[${index}][start_date]`, timeline.start_date);
        formData.append(`project_timeline[${index}][end_date]`, timeline.end_date);
      }
    }
    if (datas && datas?.project_attachments && datas?.project_attachments?.file) {
      // console.log('datas?.project_attachments?.file', datas?.project_attachments?.file);
      formData.append('project_attachments', datas?.project_attachments?.file[0] as Blob);
    } else {
      formData.append('project_attachments[url]', datas?.project_attachments?.url as string);
      formData.append('project_attachments[type]', datas?.project_attachments?.type as string);
      formData.append('project_attachments[size]', datas?.project_attachments?.size as any);
    }
    if (datas && datas?.letter_ofsupport_req && datas?.letter_ofsupport_req?.file) {
      formData.append('letter_ofsupport_req', datas?.letter_ofsupport_req?.file[0] as Blob);
    } else {
      formData.append('letter_ofsupport_req[url]', datas?.letter_ofsupport_req?.url as string);
      formData.append('letter_ofsupport_req[type]', datas?.letter_ofsupport_req?.type as string);
      formData.append('letter_ofsupport_req[size]', datas?.letter_ofsupport_req?.size as any);
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        // witoutformData
        // '/tender-proposal/save-draft',
        // { ...saveLastDraft },
        '/tender-proposal/interceptor-save-draft',
        formData,
        {
          headers: { 'x-hasura-role': activeRole! },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      if (res) {
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
        navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);

        // setToast({
        //   open: true,
        //   message: translate('proposal_created'),
        // });
        // setTimeout(() => {
        //   navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
        // }, 1000);
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
    } finally {
      setIsLoading(false);
      setIsDraft(false);
    }

    //using formData still develop
    // const payload = {
    //   ...(lastIndex >= 1 && { ...requestState.form2 }),
    //   ...(lastIndex >= 2 && { ...requestState.form3 }),
    //   ...(lastIndex >= 3 && {
    //     amount_required_fsupport: requestState.form4.amount_required_fsupport,
    //     detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
    //   }),
    //   ...(lastIndex < step && step >= 1 && { ...requestState.form1 }),
    //   ...(lastIndex < step && step >= 2 && { ...requestState.form2 }),
    //   ...(lastIndex < step && step >= 3 && { ...requestState.form3 }),
    //   ...(lastIndex < step &&
    //     step >= 4 && {
    //       amount_required_fsupport: requestState.form4.amount_required_fsupport,
    //       detail_project_budgets: [...requestState.form4.detail_project_budgets.data],
    //     }),
    //   proposal_bank_information_id: step === 4 ? data : undefined,
    //   proposal_id: id,
    // };
    // const datas = { ...payload };
    // let formData = new FormData();
    // delete payload.detail_project_budgets;
    // delete payload.project_attachments;
    // delete payload.letter_ofsupport_req;
    // delete payload.detail_project_budgets;
    // const jsonData: any = {
    //   ...payload,
    // };
    // for (const key in jsonData) {
    //   formData.append(key, jsonData[key]);
    // }
    // if (datas && datas?.detail_project_budgets && datas?.detail_project_budgets?.length > 0) {
    //   for (let i = 0; i < datas?.detail_project_budgets?.length; i++) {
    //     const budget = datas?.detail_project_budgets[i];
    //     const index = i; // Get the index for appending to FormData

    //     // Append the values for each object using template literals
    //     formData.append(`detail_project_budgets[${index}].amount`, budget.amount as any);
    //     formData.append(`detail_project_budgets[${index}].explanation`, budget.explanation);
    //     formData.append(`detail_project_budgets[${index}].clause`, budget.clause);
    //   }
    // }
    // if (datas && datas?.project_attachments && datas?.project_attachments?.file) {
    //   formData.append('project_attachments', datas?.project_attachments?.file as any);
    // } else {
    //   formData.append('project_attachments[url]', datas?.project_attachments?.url as string);
    //   formData.append('project_attachments[type]', datas?.project_attachments?.type as string);
    //   formData.append('project_attachments[size]', datas?.project_attachments?.size as any);
    // }
    // if (datas && datas?.letter_ofsupport_req && datas?.letter_ofsupport_req?.file) {
    //   formData.append('letter_ofsupport_req', datas?.letter_ofsupport_req?.file as any);
    // } else {
    //   formData.append('letter_ofsupport_req[url]', datas?.letter_ofsupport_req?.url as string);
    //   formData.append('letter_ofsupport_req[type]', datas?.letter_ofsupport_req?.type as string);
    //   formData.append('letter_ofsupport_req[size]', datas?.letter_ofsupport_req?.size as any);
    // }

    // console.log(formData.get('project_name'));
    // console.log({ datas });

    // // formData.forEach((value, key) => {
    // //   console.log(key + ' - ' + value);
    // // });

    // try {
    //   const res = await axiosInstance.post('/tender-proposal/interceptor-create', formData, {
    //     headers: { 'x-hasura-role': activeRole! },
    //     maxBodyLength: Infinity,
    //     maxContentLength: Infinity,
    //   });
    //   if (res) {
    //     const spreadUrl = location.pathname.split('/');
    //     enqueueSnackbar(translate('proposal_created'), {
    //       variant: 'success',
    //       preventDuplicate: true,
    //       autoHideDuration: 3000,
    //       anchorOrigin: {
    //         vertical: 'bottom',
    //         horizontal: 'center',
    //       },
    //     });
    //     navigate(`/${spreadUrl[1]}/${spreadUrl[2]}/draft-funding-requests`);
    //   }
    // } catch (err) {
    //   enqueueSnackbar(err.message, {
    //     variant: 'error',
    //     preventDuplicate: true,
    //     autoHideDuration: 3000,
    //     anchorOrigin: {
    //       vertical: 'bottom',
    //       horizontal: 'center',
    //     },
    //   });
    //   setIsLoading(false);
    // }
  };

  // on return
  const onReturn = () => {
    if (step === 0) {
      navigate('/client/dashboard/draft-funding-requests');
    } else {
      setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    }
  };

  const BeneficiariesList = async () => {
    await dispatch(getBeneficiariesList(activeRole!))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log({ err });
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
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    BeneficiariesList();
    if (id) {
      const tuningTheState = () => {
        if (data?.proposal_by_pk) {
          const STEP = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'];
          const {
            project_name,
            project_idea,
            project_location,
            project_implement_date,
            execution_time,
            // project_beneficiaries,
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
            project_timeline,
            timelines,
            step,
            beneficiary_details,
          } = data.proposal_by_pk;
          setRequestState((prevRegisterState: any) => ({
            ...prevRegisterState,
            project_timeline: project_timeline || timelines || [],
            form1: {
              ...prevRegisterState.form1,
              ...{
                project_name: project_name.trim(),
                project_idea,
                project_location,
                project_implement_date,
                execution_time: execution_time,
                // project_beneficiaries,
                beneficiary_id: (beneficiary_details && beneficiary_details.id) || '',
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
              // project_beneficiaries,
              beneficiary_id: (beneficiary_details && beneficiary_details.id) || '',
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
            // ...(STEP.indexOf(step.trim()) >= 4 && {
            //   project_timeline: project_timeline || timelines || [],
            // }),
          }));
          setStep(STEP.indexOf(step.trim()));
          setLastIndex(STEP.indexOf(step.trim()));
        }
      };
      tuningTheState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id]);
  if (loadingCount) return <>{translate('pages.common.loading')}</>;
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
          <ProjectTimeLine onSubmit={onSubmitform5} defaultValues={requestState?.project_timeline}>
            <ActionBox
              step={step}
              onReturn={onReturn}
              isLoad={isLoading}
              // onSavingDraft={onSavingDraft}
              isStep={id !== undefined ? true : false}
              isDraft={(draft: boolean) => setIsDraft(draft)}
            />
          </ProjectTimeLine>
        )}
        {step === 5 && (
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
        <Toast
          variant="outlined"
          // toastType="success"
          toastType={'success'}
          // message="تم التأكد من المعلومات أنها صحيحة, لحفظ تعديلاتك الرجاء الضغط على إرسال التعديلات أعلاه"
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

export default FundingProjectRequestForm;

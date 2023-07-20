import { Step, StepLabel, Stepper } from '@mui/material';
import { ModalDialogStepper } from 'components/modal-dialog/ModalDialogStepper';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { updateProposalByFacilitatedSupervisor } from 'queries/project-supervisor/updateProposalByFacilitatedSupervisor';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  setStepFive,
  setStepOne,
  setStepThree,
  setStepTwo,
  stepBackOne,
  stepResetActive,
} from 'redux/slices/supervisorAcceptingForm';
import { useDispatch, useSelector } from 'redux/store';
import { useMutation } from 'urql';
import axiosInstance from 'utils/axios';
import { getProposalCount } from '../../../../../../redux/slices/proposal';
import ActionBox from './ActionBox';
import FifthForm from './FifthForm';
import FirstForm from './FirstForm';
import SecondForm from './SecondForm';
import ThirdForm from './ThirdForm';
//

const steps = [
  'معلومات الدعم',
  'معلومات الجهة',
  'تفاصيل المشروع',
  // 'موازنة المشروع',
  'التوصية بالدعم من المشرف',
];

function FacilitateSupervisorAcceptingForm({ onClose }: any) {
  const { activeStep, isLoading, step1, step2, step3, step4, step5 } = useSelector(
    (state) => state.supervisorAcceptingForm
  );

  const { user, activeRole } = useAuth();

  const { id: proposal_id } = useParams();

  const navigate = useNavigate();

  const { translate, currentLang } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [, accept] = useMutation(updateProposalByFacilitatedSupervisor);

  const dispatch = useDispatch();

  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [numberPayment, setNumberPayment] = useState<number>(0);
  // console.log({ numberPayment });

  const handleSubmitFirstForm = (data: any) => {
    setIsSubmitting(true);
    dispatch(setStepOne(data));
    setIsSubmitting(false);
  };

  const handleSubmitSecondForm = (data: any) => {
    setIsSubmitting(true);
    dispatch(setStepTwo(data));
    setIsSubmitting(false);
  };

  const handleSubmitThirdForm = (data: any) => {
    setIsSubmitting(true);
    dispatch(setStepThree(data));
    setIsSubmitting(false);
  };

  // const handleSubmitForthForm = (data: any) => {
  //   setIsSubmitting(true);
  //   dispatch(setStepFour(data));
  //   setIsSubmitting(false);
  // };

  const handleSubmitFifthForm = async (data: any) => {
    dispatch(setStepFive(data));
    await handleSubmit(data);
  };

  const onBack = () => {
    dispatch(stepBackOne({}));
  };

  const handleSubmit = async (data: any) => {
    const { notes, ...restStep1 } = step1;
    const editedBy = location.pathname.split('/')[1];
    console.log(data, 'data');
    setIsSubmitting(true);

    try {
      const lenghtOfNumberOfPayments = data.proposal_item_budgets.length;
      const totalFSupport = data.proposal_item_budgets
        .map((el: { amount: any }) => Number(el.amount))
        .reduce((acc: any, curr: any) => acc + (curr || 0), 0);

      let payload: any = {
        proposal_id,
        action: editedBy === 'project-manager' || editedBy === 'ceo' ? 'update' : 'accept',
        message: 'تم قبول المشروع من قبل مشرف المشاريع',
        notes,
        selectLang: currentLang.value,
      };
      const newData = {
        ...restStep1,
        fsupport_by_supervisor: totalFSupport,
        number_of_payments_by_supervisor: lenghtOfNumberOfPayments,
        clause: null,
        clasification_field: null,
        accreditation_type_id: null,
        support_goal_id: null,
        chairman_of_board_of_directors: step2.chairman_of_board_of_directors,
        been_supported_before: step2.been_supported_before,
        most_clents_projects: step2.most_clents_projects,
        added_value: step3.added_value,
        reasons_to_accept: step3.reasons_to_accept,
        target_group_num: step3.target_group_num,
        target_group_type: step3.target_group_type,
        target_group_age: step3.target_group_age,
        been_made_before: step3.been_made_before,
        remote_or_insite: step3.remote_or_insite,
        // created_recommended_support: [], // data.created_recommended_support
        // updated_recommended_support: [], // data.updated_recommended_support
        // deleted_recommended_support: [], // data.deleted_recommended_support
        // item_budget_support
        // created_recommended_support: data.created_proposal_budget,
        // updated_recommended_support: data.updated_proposal_budget,
        // deleted_recommended_support: data.deleted_proposal_budget,
        created_proposal_budget: data.created_proposal_budget,
        updated_proposal_budget: data.updated_proposal_budget,
        deleted_proposal_budget: data.deleted_proposal_budget,
      };
      if (editedBy === 'project-manager') {
        payload = {
          ...payload,
          project_manager_payload: {
            ...newData,
          },
        };
      } else if (editedBy === 'ceo') {
        payload = {
          ...payload,
          ceo_payload: {
            ...newData,
          },
        };
      } else {
        payload = {
          ...payload,
          supervisor_payload: {
            ...newData,
          },
        };
      }

      // console.log('acceptSupervisorGrant', payload);

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_approved'), {
              variant: 'success',
            });
          }
          // for re count total proposal
          // dispatch(getProposalCount(activeRole ?? 'test'));
          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }
          //
          setIsSubmitting(false);
          navigate(`/${editedBy}/dashboard/app`);
          dispatch(stepResetActive({}));
        })
        .catch((err) => {
          if (typeof err.message === 'object') {
            err.message.forEach((el: any) => {
              enqueueSnackbar(el, {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              });
            });
          } else {
            // enqueueSnackbar(err.message, {
            //   variant: 'error',
            //   preventDuplicate: true,
            //   autoHideDuration: 3000,
            // });
            const statusCode = (err && err.statusCode) || 0;
            const message = (err && err.message) || null;
            enqueueSnackbar(
              `${
                statusCode < 500 && message
                  ? message
                  : translate('pages.common.internal_server_error')
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
          }

          setIsSubmitting(false);
        });
    } catch (error) {
      // enqueueSnackbar(error.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      // });

      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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
      setIsSubmitting(false);
    }
  };

  return (
    <ModalDialogStepper
      maxWidth="lg"
      title={activeStep === 0 ? 'قبول المشروع' : 'البيانات التي تعرض على لجنة المنح'}
      stepper={
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      }
      isOpen={true}
      showCloseIcon={true}
      content={
        <>
          {activeStep === 0 && (
            <FirstForm onSubmit={handleSubmitFirstForm} setPaymentNumber={setNumberPayment}>
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </FirstForm>
          )}
          {activeStep === 1 && (
            <SecondForm onSubmit={handleSubmitSecondForm}>
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </SecondForm>
          )}
          {activeStep === 2 && (
            <ThirdForm onSubmit={handleSubmitThirdForm}>
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </ThirdForm>
          )}
          {/* {activeStep === 3 && (
            <ForthFrom onSubmit={handleSubmitForthForm}>
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </ForthFrom>
          )} */}
          {activeStep === 3 && (
            <FifthForm onSubmit={handleSubmitFifthForm} paymentNumber={numberPayment}>
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </FifthForm>
          )}
        </>
      }
      onClose={onClose}
      styleContent={{ padding: '2em', backgroundColor: '#fff' }}
    />
  );
}

export default FacilitateSupervisorAcceptingForm;

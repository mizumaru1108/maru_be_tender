import { useState } from 'react';
// hooks
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
// components
import { Stack, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { ModalDialogStepper } from 'components/modal-dialog/ModalDialogStepper';
//
import { dispatch, useSelector } from 'redux/store';
import {
  setStepOne,
  stepBackOne,
  setStepFive,
  stepResetActive,
} from 'redux/slices/supervisorAcceptingForm';
import { ModalProposalType } from '../../../../../@types/project-details';
import { IsFormSubmited } from '../supervisor-facilitate-track/forms';
import ActionBox from '../supervisor-facilitate-track/forms/ActionBox';
import GeneralFirstForm from './GeneralFirstForm';
import GeneralSecondForm from './GeneralSecondForm';

import { useLocation, useNavigate, useParams } from 'react-router';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
import { getProposalCount } from 'redux/slices/proposal';

const steps = ['معلومات الدعم', 'التوصية بالدعم من المشرف'];

function ProposalAcceptingForm({ onClose, onSubmit, loading }: ModalProposalType) {
  const { translate, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const { activeRole } = useAuth();

  const { activeStep, step1 } = useSelector((state) => state.supervisorAcceptingForm);

  const { id: proposal_id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [numberPayment, setNumberPayment] = useState<number>(0);
  const [isFormSubmited, setIsFormSubmited] = useState<IsFormSubmited>({
    form1: false,
    form5: false,
  });

  const handleSubmitFirstForm = (data: any) => {
    setIsSubmitting(true);
    dispatch(setStepOne(data));
    setIsSubmitting(false);
  };

  const handleSubmitFifthForm = async (data: any) => {
    dispatch(setStepFive(data));
    await handleSubmit(data);
  };

  const handleSubmit = async (data: any) => {
    const { notes, ...restStep1 } = step1;
    const editedBy = location.pathname.split('/')[1];
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

  const onBack = () => {
    dispatch(stepBackOne({}));
  };

  return (
    <ModalDialogStepper
      maxWidth="md"
      stepper={
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      }
      title={
        <Stack>
          <Typography variant="h6" fontWeight="bold" color="#000000">
            {translate('account_manager.accept_project')}
          </Typography>
        </Stack>
      }
      content={
        <>
          {activeStep === 0 && (
            <GeneralFirstForm
              onSubmit={handleSubmitFirstForm}
              setPaymentNumber={setNumberPayment}
              isSubmited={isFormSubmited.form1}
              setIsSubmited={(data: boolean) => {
                setIsFormSubmited({ ...isFormSubmited, form1: data });
              }}
            >
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </GeneralFirstForm>
          )}

          {activeStep === 1 && (
            <GeneralSecondForm
              onSubmit={handleSubmitFifthForm}
              paymentNumber={numberPayment}
              isSubmited={isFormSubmited.form5}
              setIsSubmited={(data: boolean) => {
                setIsFormSubmited({ ...isFormSubmited, form5: data });
              }}
            >
              <ActionBox
                isLoading={isSubmitting}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </GeneralSecondForm>
          )}
        </>
      }
      isOpen={true}
      onClose={onClose}
      styleContent={{ padding: '2em', backgroundColor: '#fff' }}
      showCloseIcon={true}
    />
  );
}

export default ProposalAcceptingForm;

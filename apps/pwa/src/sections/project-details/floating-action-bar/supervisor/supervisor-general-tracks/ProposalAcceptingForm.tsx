import React, { useState } from 'react';
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
  setStepsData,
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
import { FusionAuthRoles } from '../../../../../@types/commons';

const steps = ['معلومات الدعم', 'التوصية بالدعم من المشرف'];

function ProposalAcceptingForm({ onClose }: ModalProposalType) {
  const { translate, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const { activeRole } = useAuth();

  const { activeStep, step1 } = useSelector((state) => state.supervisorAcceptingForm);
  const { proposal } = useSelector((state) => state.proposal);

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
    const tmpData = {
      ...data,
      payment_number: Number(data?.payment_number),
      fsupport_by_supervisor: Number(data?.fsupport_by_supervisor),
      section_id: data?.section_id,
    };
    setIsSubmitting(true);
    dispatch(setStepOne(tmpData));
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
      let payload: any = {
        proposal_id,
        // action: editedBy === 'project-manager' || editedBy === 'ceo' ? 'update' : 'accept',
        action: 'accept',
        message: 'تم قبول المشروع من قبل مشرف المشاريع',
        notes,
        selectLang: currentLang.value,
      };

      const newData = {
        ...restStep1,
        fsupport_by_supervisor: Number(step1?.fsupport_by_supervisor),
        number_of_payments_by_supervisor: Number(step1?.payment_number),
        clause: null,
        clasification_field: null,
        accreditation_type_id: null,
        support_goal_id: step1?.support_goal_id,
        created_proposal_budget: data.created_proposal_budget,
        updated_proposal_budget: data.updated_proposal_budget,
        deleted_proposal_budget: data.deleted_proposal_budget,
        support_outputs: data?.support_outputs || '-',
      };
      // console.log({ newData, step1 });
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

  React.useEffect(() => {
    dispatch(setStepsData(proposal, activeRole! as FusionAuthRoles));
  }, [proposal, activeRole]);

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

import { StepLabel, Stepper, Step } from '@mui/material';
import { ModalDialogStepper } from 'components/modal-dialog/ModalDialogStepper';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { updateProposalByFacilitatedSupervisor } from 'queries/project-supervisor/updateProposalByFacilitatedSupervisor';
import { useNavigate, useParams } from 'react-router';
import {
  setStepFive,
  setStepFour,
  setStepOne,
  setStepThree,
  setStepTwo,
  stepBackOne,
} from 'redux/slices/supervisorAcceptingForm';
import { useDispatch, useSelector } from 'redux/store';
import { useMutation } from 'urql';
import ActionBox from './ActionBox';
import FifthForm from './FifthForm';
import FirstForm from './FirstForm';
import ForthFrom from './ForthFrom';
import SecondForm from './SecondForm';
import ThirdForm from './ThirdForm';

const steps = [
  'معلومات الدعم',
  'معلومات الجهة',
  'تفاصيل المشروع',
  'موازنة المشروع',
  'التوصية بالدعم من المشرف',
];

function FacilitateSupervisorAcceptingForm({ onClose }: any) {
  const { activeStep, isLoading, step1, step2, step3, step4, step5 } = useSelector(
    (state) => state.supervisorAcceptingForm
  );

  const { user } = useAuth();

  const { id: proposal_id } = useParams();

  const navigate = useNavigate();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [, accept] = useMutation(updateProposalByFacilitatedSupervisor);

  const dispatch = useDispatch();

  const handleSubmitFirstForm = (data: any) => {
    dispatch(setStepOne(data));
  };

  const handleSubmitSecondForm = (data: any) => {
    dispatch(setStepTwo(data));
  };

  const handleSubmitThirdForm = (data: any) => {
    dispatch(setStepThree(data));
  };

  const handleSubmitForthForm = (data: any) => {
    dispatch(setStepFour(data));
  };

  const handleSubmitFifthForm = async (data: any) => {
    await dispatch(setStepFive(data));
    await handleSubmit(data);
  };

  const onBack = () => {
    dispatch(stepBackOne({}));
  };

  const handleSubmit = async (data: any) => {
    const { notes, ...restStep1 } = step1;
    console.log({
      notes,
      ...restStep1,
      data,
    });

    // accept({
    //   proposal_id,
    //   log: {
    //     id: nanoid(),
    //     proposal_id,
    //     reviewer_id: user?.id,
    //     action: 'accept',
    //     message: 'تم قبول المشروع من قبل مشرف المشاريع ',
    //     notes: notes,
    //     user_role: 'PROJECT_SUPERVISOR',
    //     state: 'PROJECT_SUPERVISOR',
    //   },
    //   new_values: {
    //     inner_status: 'ACCEPTED_BY_SUPERVISOR',
    //     outter_status: 'ONGOING',
    //     state: 'PROJECT_MANAGER',
    //     ...restStep1,
    //     chairman_of_board_of_directors: step2.chairman_of_board_of_directors,
    //     been_supported_before: step2.been_supported_before,
    //     most_clents_projects: step2.most_clents_projects,
    //     added_value: step3.added_value,
    //     reasons_to_accept: step3.reasons_to_accept,
    //     target_group_num: step3.target_group_num,
    //     target_group_type: step3.target_group_type,
    //     target_group_age: step3.target_group_age,
    //     been_made_before: step3.been_made_before,
    //     remote_or_insite: step3.remote_or_insite,
    //   },
    //   recommended_support: [
    //     ...data.recommended_support.map((item: any) => ({
    //       proposal_id,
    //       clause: item.clause,
    //       amount: item.amount,
    //       explanation: item.explanation,
    //       id: nanoid(),
    //     })),
    //   ],
    // }).then((res) => {
    //   if (res.error) {
    //     enqueueSnackbar(res.error.message, {
    //       variant: 'error',
    //       preventDuplicate: true,
    //       autoHideDuration: 3000,
    //     });
    //   } else {
    //     enqueueSnackbar(translate('proposal_accept'), {
    //       variant: 'success',
    //     });
    //     navigate(`/project-supervisor/dashboard/app`);
    //   }
    // });
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
            <FirstForm onSubmit={handleSubmitFirstForm}>
              <ActionBox
                isLoading={isLoading}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </FirstForm>
          )}
          {activeStep === 1 && (
            <SecondForm onSubmit={handleSubmitSecondForm}>
              <ActionBox
                isLoading={isLoading}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </SecondForm>
          )}
          {activeStep === 2 && (
            <ThirdForm onSubmit={handleSubmitThirdForm}>
              <ActionBox
                isLoading={isLoading}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </ThirdForm>
          )}
          {activeStep === 3 && (
            <ForthFrom onSubmit={handleSubmitForthForm}>
              <ActionBox
                isLoading={isLoading}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </ForthFrom>
          )}
          {activeStep === 4 && (
            <FifthForm onSubmit={handleSubmitFifthForm}>
              <ActionBox
                isLoading={isLoading}
                onClose={onClose}
                step={activeStep}
                onBack={onBack}
              />
            </FifthForm>
          )}
        </>
      }
      onClose={onClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default FacilitateSupervisorAcceptingForm;

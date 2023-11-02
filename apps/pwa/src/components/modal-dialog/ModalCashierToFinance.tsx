import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// component
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
// hook
import { FormProvider } from '../hook-form';
import RHFTextArea from '../hook-form/RHFTextArea';
import useLocales from '../../hooks/useLocales';
import { useParams, useNavigate } from 'react-router';
//
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import { FEATURE_PROPOSAL_COUNTING } from 'config';
import { dispatch } from 'redux/store';
import { getProposalCount } from 'redux/slices/proposal';

// ==========================================================================================

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormData = {
  notes: string;
};

// ==========================================================================================

export default function ModalCashierToFinance({ open, onClose }: Props) {
  const { translate, currentLang } = useLocales();
  const { id: proposal_id } = useParams();

  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    notes: Yup.string().required(translate('errors.cre_proposal.notes.required')),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: any) => {
    try {
      const payload = {
        proposal_id: proposal_id,
        action: 'step_back',
        message: 'تم إرجاع المشروع خطوة للوراء',
        notes: data.notes,
        selectLang: currentLang.value,
      };

      await axiosInstance
        .patch('/tender-proposal/change-state', payload, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            enqueueSnackbar(translate('proposal_rejected'), {
              variant: 'success',
            });
          }

          if (FEATURE_PROPOSAL_COUNTING) {
            dispatch(getProposalCount(activeRole ?? 'test'));
          }

          onClose();
          reset({
            notes: '',
          });

          navigate(`/`);
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
    }
  };

  const closeModal = () => {
    reset({
      notes: '',
    });
    onClose();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {translate('proposal_amandement.tender_cashier.dialog.title')}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFTextArea
                name="notes"
                label={translate('funding_project_request_form1.notes.label')}
                placeholder={translate('funding_project_request_form1.notes.placeholder')}
              />
            </Grid>
          </Grid>
        }
        showCloseIcon={true}
        actionBtn={
          <Stack direction="row" justifyContent="space-around" gap={4}>
            <Button
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
              onClick={() => {
                onClose();
                reset({
                  notes: '',
                });
              }}
            >
              {translate('button.cancel')}
            </Button>
            <LoadingButton
              loading={isSubmitting}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              color="primary"
            >
              {translate('proposal_amandement.tender_cashier.dialog.button.submit')}
            </LoadingButton>
          </Stack>
        }
        isOpen={open}
        onClose={closeModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </FormProvider>
  );
}

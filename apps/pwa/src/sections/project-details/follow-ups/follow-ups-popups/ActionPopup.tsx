import { Button, Stack, Typography, Grid } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import { LoadingButton } from '@mui/lab';
import { addFollowups, getProposal } from 'redux/slices/proposal';
import { useDispatch } from 'redux/store';
import { useSnackbar } from 'notistack';
import React from 'react';
import axiosInstance from 'utils/axios';

type Props = {
  open: boolean;
  handleClose: () => void;
};

type FormData = {
  action: string;
};

function ActionPopup({ open, handleClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const dispatch = useDispatch();

  const { id: proposal_id } = useParams();

  const validationSchema = Yup.object().shape({
    action: Yup.string().required('Action is required!'),
  });

  const defaultValues = {
    action: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { user, activeRole } = useAuth();

  // const id = user?.id;
  const role = activeRole!;

  const onSubmit = async (data: any) => {
    try {
      // addFollowups({ content: data.action, proposal_id, follow_up_type: 'plain' }, role)
      const response = await axiosInstance.post(
        'tender-proposal/follow-up/create',
        { content: data.action, proposal_id, follow_up_type: 'plain' },
        {
          headers: { 'x-hasura-role': role },
        }
      );
      if (response) {
        dispatch(getProposal(id as string));
        enqueueSnackbar('تم رفع الإجراء بنجاح', {
          variant: 'success',
        });
        reset();
        handleClose();
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              إضافة إجراء
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="action"
                placeholder="الرجاء كتابة الإجراءات التي قمت بها  على المشروع "
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
              onClick={handleClose}
            >
              رجوع
            </Button>
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              sx={{
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                backgroundColor: '#0E8478',
                ':hover': { backgroundColor: '#13B2A2' },
              }}
              loading={isSubmitting}
            >
              اضافة
            </LoadingButton>
          </Stack>
        }
        isOpen={open}
        onClose={handleClose}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </FormProvider>
  );
}

export default ActionPopup;

import { Button, Grid, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router';
import { nanoid } from 'nanoid';
import { FormProvider } from 'components/hook-form';
import { LoadingButton } from '@mui/lab';
import BaseField from 'components/hook-form/BaseField';
import { addFollowups, getProposal } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import axiosInstance from 'utils/axios';
import useLocales from '../../../../hooks/useLocales';

type Props = {
  open: boolean;
  handleClose: () => void;
};

type FormData = {
  file: {
    url: string;
    size: number;
    type: string;
  };
};

function FilePopup({ open, handleClose }: Props) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentLang, translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();
  const { employeeOnly } = useSelector((state) => state.proposal);

  const validationSchema = Yup.object().shape({
    file: Yup.object().shape({
      url: Yup.string().required('url is required!'),
      size: Yup.number().required('size is required!'),
      type: Yup.string().required('type is required!'),
    }),
  });

  const defaultValues = {
    file: {
      url: '',
      size: 0,
      type: 'image/jpeg',
    },
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

  const { id: proposal_id } = useParams();

  const { user, activeRole } = useAuth();

  // const id = user?.id;
  const role = activeRole!;

  const onSubmit = async (data: any) => {
    if (role === 'tender_client') {
      try {
        // const url = 'tender-proposal/follow-up/create';
        const url = 'tender-proposal/follow-up/create-cqrs';
        const response = await axiosInstance.post(
          url,
          {
            follow_up_attachment: [data.file],
            proposal_id,
            follow_up_type: 'attachments',
            employee_only: false,
            selectLang: currentLang.value,
          },
          {
            headers: { 'x-hasura-role': role },
          }
        );
        if (response) {
          dispatch(getProposal(id as string, role as string));
          enqueueSnackbar('تم رفع الإجراء بنجاح', {
            variant: 'success',
          });
          reset();
          handleClose();
        }
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
      }
    } else {
      try {
        // await dispatch(addFollowups({follow_up_attachment: [data.file],proposal_id,follow_up_type: 'attachments',},role));
        // const url = 'tender-proposal/follow-up/create';
        const url = 'tender-proposal/follow-up/create-cqrs';
        const response = await axiosInstance.post(
          url,
          {
            follow_up_attachment: [data.file],
            proposal_id,
            follow_up_type: 'attachments',
            employee_only: employeeOnly,
            selectLang: currentLang.value,
          },
          {
            headers: { 'x-hasura-role': role },
          }
        );
        if (response) {
          dispatch(getProposal(id as string, role as string));
          enqueueSnackbar('تم رفع الإجراء بنجاح', {
            variant: 'success',
          });
          reset();
          handleClose();
        }
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
      }
    }
  };
  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            إضافة تعليق
          </Typography>
        </Stack>
      }
      content={
        <FormProvider methods={methods}>
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <BaseField
                type="uploadBe"
                name="file"
                placeholder="الرجاء كتابة الإجراءات التي قمت بها  على المشروع "
              />
            </Grid>
          </Grid>
        </FormProvider>
      }
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
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
      showCloseIcon={true}
    />
  );
}

export default FilePopup;

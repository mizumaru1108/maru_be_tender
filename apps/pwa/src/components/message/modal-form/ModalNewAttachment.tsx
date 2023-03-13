import { Button, Container, Grid, Stack, Typography } from '@mui/material';
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
import useLocales from '../../../hooks/useLocales';
import { FileProp } from '../../upload';

type Props = {
  open: boolean;
  handleClose: () => void;
  attachment_type: 'file' | 'image' | 'text';
  header_title: string;
  onSubmit: (data: FileProp) => void;
};

type FormData = {
  file: {
    url: string;
    size: number | undefined;
    type: string;
    base64Data?: string;
    fileExtension?: string;
    fullName?: string;
  };
};

function ModalNewAttachment({ open, handleClose, attachment_type, header_title, onSubmit }: Props) {
  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const file_image_schema = Yup.mixed()
    .test('size', translate('errors.register.license_file.size'), (value) => {
      if (value) {
        if (value.size > 1024 * 1024 * 3) {
          return false;
        }
      }
      return true;
    })
    .test('fileExtension', translate('errors.register.card_image.fileExtension'), (value) => {
      if (value) {
        if (
          value.type !== 'image/png' &&
          value.type !== 'image/jpeg' &&
          value.type !== 'image/jpg'
        ) {
          return false;
        }
      }
      return true;
    });
  const file_schema = Yup.mixed()
    .test('size', translate('errors.register.license_file.size'), (value) => {
      if (value) {
        if (value.size > 1024 * 1024 * 3) {
          return false;
        }
      }
      return true;
    })
    .test(
      'fileExtension',
      translate('errors.cre_proposal.project_attachments.fileExtension'),
      (value) => {
        if (value) {
          if (value.type !== 'application/pdf') {
            return false;
          }
        }
        return true;
      }
    );
  const validationSchema = Yup.object().shape({
    // file: Yup.object().shape({
    //   url: Yup.string().required('url is required!'),
    //   size: Yup.number().required('size is required!'),
    //   type: Yup.string().required('type is required!'),
    // }),
    file:
      attachment_type === 'image'
        ? file_image_schema
        : attachment_type === 'file'
        ? file_schema
        : Yup.object(),
  });

  const defaultValues = {
    file: {
      url: '',
      size: 0,
      type: 'image/jpeg',
      base64Data: '',
      fileExtension: '',
      fullName: '',
    },
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

  // const { activeRole } = useAuth();
  // const role = activeRole!;

  const onSubmitted = (data: any) => {
    // console.log('data', data.file);
    onSubmit(data.file);
    reset({
      file: defaultValues.file,
    });
    handleClose();
  };
  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            {/* إضافة تعليق */}
            {/* {header_title} */}
            {translate(`${header_title}`)}
          </Typography>
        </Stack>
      }
      content={
        <Container>
          <FormProvider methods={methods}>
            <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
              <Grid item md={12} xs={12}>
                <BaseField
                  type="uploadBe"
                  name="file"
                  placeholder={translate('upload_select_drop')}
                />
              </Grid>
            </Grid>
          </FormProvider>
        </Container>
      }
      isOpen={open}
      onClose={() => {
        reset({
          file: defaultValues.file,
        });
        handleClose();
      }}
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
            onClick={() => {
              reset({
                file: defaultValues.file,
              });
              handleClose();
            }}
          >
            {/* رجوع */}
            {translate('button.cancel')}
          </Button>
          <LoadingButton
            onClick={handleSubmit(onSubmitted)}
            type="submit"
            sx={{
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              backgroundColor: '#0E8478',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            loading={isSubmitting}
          >
            {/* اضافة */}
            {translate('button.confirm')}
          </LoadingButton>
        </Stack>
      }
      showCloseIcon={true}
    />
  );
}

export default ModalNewAttachment;

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  createGregorianYear,
  getGregorianYearById,
  updateGregorianYear,
} from '../../../../redux/slices/gregorian-year';
import { dispatch, useSelector } from '../../../../redux/store';
import { CatchErrorMessage, ErrorSnackBar } from '../../../../utils/catchError';
import RHFSelectNoGenerator from '../../../hook-form/RHFSelectNoGen';

interface Props {
  id?: string;
  isDelete?: boolean;
  onClose: () => void;
}

interface FormInput {
  year: string;
}

const AddNewGregorianYear = ({ isDelete = false, id, onClose }: Props) => {
  const { translate, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  // redux
  const { loadingProps } = useSelector((state) => state.gregorianYear);

  const validationSchema = Yup.object().shape({
    year: Yup.string().required(translate('_gregorian_year.fields.year.error.required')),
  });

  const defaultValues = {
    year: '',
  };

  const methods = useForm<FormInput>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: FormInput) => {
    if (!id) {
      await dispatch(createGregorianYear(activeRole!, { year: data.year }))
        .then(() => {
          console.log('success');
        })
        .catch((error) => {
          ErrorSnackBar(error, enqueueSnackbar, translate);
        });
    } else {
      await dispatch(updateGregorianYear(activeRole!, { id, year: data.year }))
        .then(() => {
          console.log('success');
        })
        .catch((error) => {
          ErrorSnackBar(error, enqueueSnackbar, translate);
        });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getGregorianYearById(activeRole!, id))
        .then(() => {
          console.log('success');
        })
        .catch((error) => {
          ErrorSnackBar(error, enqueueSnackbar, translate);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, id]);

  return (
    <FormProvider methods={methods}>
      <Grid container sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', mb: 7, mt: 3 }}
        >
          {!!id
            ? `${translate('_gregorian_year.modal.edit')}`
            : translate('_gregorian_year.modal.add')}
        </Typography>
        <Grid item md={12} xs={12} sx={{ mb: 3 }}>
          <RHFSelectNoGenerator
            name="year"
            size="medium"
            label={translate('_gregorian_year.fields.year.label')}
            placeholder={translate('modal.placeholder.choose_one')}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 3 }}
            disabled={loadingProps.stateLoading}
          >
            {[...Array(22)].map((_, index) => (
              <option key={index} value={index + 2022} style={{ backgroundColor: '#fff' }}>
                {index + 2022}
              </option>
            ))}
          </RHFSelectNoGenerator>
        </Grid>

        <Grid item md={12} xs={12} sx={{ mb: 3 }}>
          <Stack justifyContent="center" direction="row" gap={2}>
            {!isDelete && (
              <LoadingButton
                loading={loadingProps.stateLoading}
                onClick={handleSubmit(onSubmitForm)}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: 'background.paper',
                  color: '#fff',
                  width: { xs: '100%', sm: '170px' },
                  height: { xs: '100%', sm: '40px' },
                  '&:hover': { backgroundColor: '#13B2A2' },
                }}
              >
                {translate('button.save')}
              </LoadingButton>
            )}
            {isDelete && (
              <LoadingButton
                loading={loadingProps.stateLoading}
                onClick={handleSubmit(onSubmitForm)}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#FF4842',
                  color: '#fff',
                  width: { xs: '100%', sm: '170px' },
                  height: { xs: '100%', sm: '40px' },
                  '&:hover': { backgroundColor: '#ff6e66' },
                }}
              >
                {translate('button.delete')}
              </LoadingButton>
            )}
            <Button
              onClick={onClose}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '170px' },
                hieght: { xs: '100%', sm: '40px' },
                ':hover': { backgroundColor: '#DFE3E8' },
              }}
            >
              {translate('button.back')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AddNewGregorianYear;

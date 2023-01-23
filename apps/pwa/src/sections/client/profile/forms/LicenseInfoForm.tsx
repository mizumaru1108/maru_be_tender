import * as Yup from 'yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFDatePicker, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LicenseValuesProps } from '../../../../@types/register';
import useLocales from 'hooks/useLocales';
import BaseField from 'components/hook-form/BaseField';
import { useEffect, useMemo } from 'react';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: LicenseValuesProps;
  isEdit?: boolean;
};

const LicenseInfoForm = ({ children, onSubmit, defaultValues, isEdit }: FormProps) => {
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
    license_number: Yup.string().required('License Number is required'),
    license_issue_date: Yup.string().required('License Issue Date is required'),
    license_expired: Yup.string().required('License Expiry Date is required'),
    license_file: Yup.mixed()
      .test('size', translate('errors.register.license_file.size'), (value) => {
        if (value) {
          // const trueSize = value.size * 28;
          if (value.size > 1024 * 1024 * 5) {
            return false;
          }
        }
        return true;
      })
      .test('fileExtension', translate('errors.register.license_file.fileExtension'), (value) => {
        if (value) {
          if (
            value.type !== 'application/pdf' &&
            value.type !== 'image/png' &&
            value.type !== 'image/jpeg' &&
            value.type !== 'image/jpg'
          ) {
            return false;
          }
        }
        return true;
      }),
    board_ofdec_file: Yup.mixed()
      .test('size', translate('errors.register.board_ofdec_file.size'), (value) => {
        if (value) {
          // const trueSize = value.size * 28;
          if (value.size > 1024 * 1024 * 5) {
            return false;
          }
        }
        return true;
      })
      .test(
        'fileExtension',
        translate('errors.register.board_ofdec_file.fileExtension'),
        (value) => {
          if (value) {
            if (
              value.type !== 'application/pdf' &&
              value.type !== 'application/msword' &&
              value.type !==
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
              value.type !== 'application/vnd.ms-excel' &&
              value.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
              value.type !== 'application/vnd.ms-powerpoint' &&
              value.type !==
                'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
              value.type !== 'image/png' &&
              value.type !== 'image/jpeg' &&
              value.type !== 'image/jpg'
            ) {
              return false;
            }
          }
          return true;
        }
      ),
  });

  const methods = useForm<LicenseValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const { handleSubmit, reset } = methods;

  const onSubmitForm = async (data: LicenseValuesProps) => {
    onSubmit(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="license_number"
            label={translate('register_form3.license_number.label')}
            placeholder={translate('register_form3.license_number.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            disabled={isEdit}
            name="license_issue_date"
            label={translate('register_form3.license_issue_date.label')}
            placeholder={translate('register_form3.license_issue_date.placeholder')}
            InputProps={{
              inputProps: {
                max: new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString()
                  .split('T')[0],
              },
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            disabled={isEdit}
            name="license_expired"
            label={translate('register_form3.license_expiry_date.label')}
            placeholder={translate('register_form3.license_expiry_date.placeholder')}
            InputProps={{
              inputProps: {
                min: new Date(new Date().setDate(new Date().getDate() + 2))
                  .toISOString()
                  .split('T')[0],
              },
            }}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField type="uploadLabel" label="register_form3.license_file.label" />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            disabled={isEdit}
            type="uploadBe"
            name="license_file"
            label="register_form3.license_file.label"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField type="uploadLabel" label="register_form3.resolution_file.label" />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            disabled={isEdit}
            type="uploadBe"
            name="board_ofdec_file"
            label="register_form3.resolution_file.label"
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '10px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default LicenseInfoForm;

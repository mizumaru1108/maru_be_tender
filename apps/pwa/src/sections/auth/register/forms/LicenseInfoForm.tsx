import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LicenseValuesProps } from '../../../../@types/register';
import FormGenerator from '../../../../components/FormGenerator';
import { LicenseInfoData } from '../../../client/funding-project-request/Forms-Data';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: LicenseValuesProps;
};

const LicenseInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
    license_number: Yup.string().required(translate('errors.register.license_number.required')),
    license_issue_date: Yup.string().required(
      translate('errors.register.license_issue_date.required')
    ),
    license_expired: Yup.string().required(translate('errors.register.license_expired.required')),
    license_file: Yup.mixed()
      .test('size', translate('errors.register.license_file.size'), (value) => {
        if (value) {
          // const trueSize = value.size * 28;
          if (value.size > 1024 * 1024 * 30) {
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
          if (value.size > 1024 * 1024 * 30) {
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

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = methods;
  const agree_on = watch('license_file');
  console.log({ agree_on });

  // const onSubmitForm = async (data: LicenseValuesProps) => {
  //   reset({ ...data });
  //   onSubmit(data);
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={LicenseInfoData} />
        <Grid item md={12} xs={12} sx={{ mb: '10px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default LicenseInfoForm;

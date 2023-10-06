import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFDatePicker, RHFTextField } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import useLocales from 'hooks/useLocales';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LicenseValuesProps } from '../../../../@types/register';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: LicenseValuesProps;
  isEdit?: boolean;
};

const LicenseInfoForm = ({ children, onSubmit, defaultValues, isEdit }: FormProps) => {
  // console.log({ defaultValues });
  const { translate } = useLocales();
  const [tmpLicenseValues, setTmpLicenseValues] = useState<LicenseValuesProps>(defaultValues);
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
          if (value.size > 1024 * 1024 * 3) {
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
    board_ofdec_file: Yup.array()
      .min(1, translate('errors.register.board_ofdec_file.required'))
      .nullable(),
  });

  const methods = useForm<LicenseValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const { handleSubmit, reset } = methods;

  const onSubmitForm = async (data: LicenseValuesProps) => {
    setTmpLicenseValues(data);
    // console.log('data', data);
    onSubmit(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isEdit) {
      reset(tmpLicenseValues);
    } else {
      let newValues = { ...defaultValues };
      let newLetters: any = [];
      const checkBoardOfDec = defaultValues.board_ofdec_file.every((item: any) => !!item)
        ? true
        : false;
      if (
        defaultValues &&
        defaultValues.board_ofdec_file &&
        typeof defaultValues.board_ofdec_file !== 'string' &&
        defaultValues.board_ofdec_file.length > 0 &&
        checkBoardOfDec
      ) {
        newLetters = [
          ...newLetters,
          ...defaultValues.board_ofdec_file.map((item: any) => {
            const { url } = item;
            return {
              ...item,
              preview: url,
            };
          }),
        ];
      } else if (
        defaultValues &&
        defaultValues.board_ofdec_file &&
        typeof defaultValues.board_ofdec_file === 'object'
      ) {
        newLetters.push({
          ...(defaultValues &&
            typeof defaultValues.board_ofdec_file === 'object' && {
              ...(defaultValues.board_ofdec_file as object),
            }),
          preview: defaultValues.board_ofdec_file.url,
        });
      }
      if (newLetters.length > 0 && checkBoardOfDec)
        newValues = { ...newValues, board_ofdec_file: [...newLetters] };
      else newValues = { ...newValues, board_ofdec_file: [] };
      reset(newValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

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
            // disabled
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
            // disabled
            type="uploadMulti"
            name="board_ofdec_file"
            // label="register_form3.resolution_file.label"
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

import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { BankingValuesProps } from '../../../../@types/register';
import useLocales from '../../../../hooks/useLocales';
import { BankingInfoData } from '../RegisterFormData';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: BankingValuesProps;
};

const BankingInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const { translate } = useLocales();

  const RegisterSchema = Yup.object().shape({
    // /^[a-zA-Z]{2}(?:0[2-9]|[1-8][0-9]|9[0-8])[a-zA-Z0-9\s]{4}[0-9\s]{6}[a-zA-Z0-9\s]{0,20}$/,
    bank_account_number: Yup.string()
      .min(27, translate('errors.register.bank_account_number.min'))
      .required(translate('errors.register.bank_account_number.required')),
    bank_account_name: Yup.string().required(
      translate('errors.register.bank_account_name.required')
    ),
    bank_name: Yup.string().required(translate('errors.register.bank_name.required')),
    card_image: Yup.mixed()
      .test('size', translate('errors.register.card_image.size'), (value) => {
        if (value) {
          // const trueSize = value.size * 28;
          if (value.size > 1024 * 1024 * 30) {
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
      })
      .required(translate('errors.register.card_image.required')),
  });

  const methods = useForm<BankingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
  } = methods;

  const onSubmitForm = async (data: BankingValuesProps) => {
    let newData = { ...data };
    let newBankAccNumber = getValues('bank_account_number');

    newBankAccNumber.substring(0, 2) !== 'SA'
      ? (newBankAccNumber = 'SA'.concat(`${getValues('bank_account_number')}`).replace(/\s/g, ''))
      : (newBankAccNumber = getValues('bank_account_number'));
    newData = { ...newData, bank_account_number: newBankAccNumber };
    reset({ ...data });
    onSubmit(newData);
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    // cleanedValue = cleanedValue.replace(/(.{4})/g, '$1 ');
    const newBankAccNumber = defaultValues.bank_account_number
      ?.replace('SA', '')
      .replace(/(.{4})/g, '$1 ');
    newValues = { ...newValues, bank_account_number: newBankAccNumber };
    reset(newValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={BankingInfoData} />
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default BankingInfoForm;

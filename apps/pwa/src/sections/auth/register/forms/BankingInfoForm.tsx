import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { BankingInfoData } from '../RegisterFormData';
import { BankingValuesProps } from '../../../../@types/register';
import useLocales from '../../../../hooks/useLocales';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: BankingValuesProps;
};

const BankingInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const { translate } = useLocales();

  const RegisterSchema = Yup.object().shape({
    // bank_account_number: Yup.string().required('Bank Account Number required'),
    // use regex to validate bank_account_number
    // use regex ^[a-zA-Z]{2}(?:0[2-9]|[1-8][0-9]|9[0-8])[a-zA-Z0-9]{4}[0-9]{6}[a-zA-Z0-9]{0,20}$
    bank_account_number: Yup.string()
      .matches(
        /^[a-zA-Z]{2}(?:0[2-9]|[1-8][0-9]|9[0-8])[a-zA-Z0-9\s]{4}[0-9\s]{6}[a-zA-Z0-9\s]{0,20}$/,
        translate('errors.register.bank_account_number.match')
      )
      .required(translate('errors.register.bank_account_number.required')),
    bank_account_name: Yup.string().required(
      translate('errors.register.bank_account_name.required')
    ),
    bank_name: Yup.string().required(translate('errors.register.bank_name.required')),
    // card_image: Yup.object().shape({
    //   url: Yup.string(),
    //   size: Yup.number(),
    //   type: Yup.string(),
    // }),
    card_image: Yup.mixed()
      .test('size', translate('errors.register.card_image.size'), (value) => {
        if (value) {
          const trueSize = value.size * 28;
          if (trueSize > 1024 * 1024 * 5) {
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
  } = methods;

  const onSubmitForm = async (data: BankingValuesProps) => {
    let newData = { ...data };
    const newBankAccountNumber = data.bank_account_number.replace(/\s/g, '');
    newData = { ...newData, bank_account_number: newBankAccountNumber };
    reset({ ...data });
    onSubmit(newData);
  };

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

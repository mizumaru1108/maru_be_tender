import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { AdministrativeInfoData } from '../form-data';
import { AdministrativeValuesProps } from '../../../../@types/register';

type FormProps = {
  onSubmit: (data: any) => void;
  defaultValues: any;
  children?: React.ReactNode;
};

const AdministrativeInfoForm = ({ onSubmit, defaultValues, children }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    ceo_name: Yup.string().required('Executive Director is required'),
    ceo_mobile: Yup.string()
      .required('CEO Mobile is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The CEO Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    data_entry_name: Yup.string().required('Entery Data Name is required'),
    data_entry_mobile: Yup.string()
      .required('Data Entry Mobile is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Data Entry Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    data_entry_mail: Yup.string().email().required('Entery Data Email is required'),
  });

  const methods = useForm<AdministrativeValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const agree_on = watch('agree_on');
  const onSubmitForm = async (data: AdministrativeValuesProps) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={AdministrativeInfoData} />
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AdministrativeInfoForm;

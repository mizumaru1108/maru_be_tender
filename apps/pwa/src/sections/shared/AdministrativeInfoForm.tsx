import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { AdministrativeInfoData } from '../auth/register/RegisterFormData';
import { AdministrativeValuesProps } from './types';

type FormProps = {
  onReturn: () => void;
  onSubmit: (data: any) => void;
  defaultValues: AdministrativeValuesProps;
  done: boolean;
};

const AdministrativeInfoForm = ({ onSubmit, defaultValues, onReturn, done }: FormProps) => {
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
    agree_on: Yup.boolean().required('Agreeing_On is required'),
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
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                if (onReturn !== undefined) onReturn();
              }}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
              }}
            >
              رجوع
            </Button>
            <Button
              type="submit"
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
              }}
              disabled={agree_on ? false : true}
            >
              {done ? 'تأكيد' : 'التالي'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AdministrativeInfoForm;

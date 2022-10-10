import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Stack } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import useLocales from '../../../hooks/useLocales';
import SvgIconStyle from '../../SvgIconStyle';
import { NewMessageFormFields } from './form-data';
import { NewMessageModalFormProps, NewMessageModalFormValues } from './types';

export default function NewMessageModalForm({ children, onSubmit }: NewMessageModalFormProps) {
  const { translate } = useLocales();
  const validationSchema = Yup.object().shape({
    trackType: Yup.string().required('Procedures is required!'),
    employeeId: Yup.string().required('Support Output is required!'),
  });

  const defaultValues = {
    trackType: '',
    employeeId: '',
  };

  const methods = useForm<NewMessageModalFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: NewMessageModalFormValues) => {
    onSubmit(data);
  };

  const EMPLOYEES = [
    { value: '123123', label: 'Mohamed - Admin' },
    { value: '123124', label: 'Ahmed - CEO' },
    { value: '123125', label: 'Ali - Moderator' },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={NewMessageFormFields} />
        {/* create form with label */}
        <Grid item xs={12}>
          {translate('new_message_modal.form.label.employees')}
          {/* grid split by 2 (6)*/}
          <Grid container rowSpacing={1} columnSpacing={2} sx={{ mt: '10px' }}>
            {EMPLOYEES.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: '10px',
                    p: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF0F2',
                  }}
                  justifyContent="space-between"
                >
                  <Stack direction="row">
                    <img src="/assets/icons/users-alt-green.svg" alt="user_icons" />
                    <Box sx={{ my: 'auto', ml: 1 }}>{item.label}</Box>
                  </Stack>
                  <SvgIconStyle
                    src={`/assets/icons/dashboard-header/message-bar.svg`}
                    sx={{ width: 25, height: 25, color: '#000' }}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

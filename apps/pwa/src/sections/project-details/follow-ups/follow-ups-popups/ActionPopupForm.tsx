import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'components/hook-form';
import { Grid } from '@mui/material';
import BaseField from 'components/hook-form/BaseField';

type FormData = {
  action: string;
};
function ActionPopupForm({ onSubmit, children }: any) {
  const validationSchema = Yup.object().shape({
    action: Yup.string().required('Action is required!'),
  });

  const defaultValues = {
    action: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="action"
            placeholder="الرجاء كتابة الإجراءات التي قمت بها  على المشروع "
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ActionPopupForm;

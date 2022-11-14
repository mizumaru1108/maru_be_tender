import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'components/hook-form';
import { Grid } from '@mui/material';
import BaseField from 'components/hook-form/BaseField';

type FormData = {
  file: {
    url: string;
    size: number;
    type: string;
  };
};
function FilePopupForm({ onSubmit, children }: any) {
  const validationSchema = Yup.object().shape({
    file: Yup.object().shape({
      url: Yup.string().required('url is required!'),
      size: Yup.number().required('size is required!'),
      type: Yup.string().required('type is required!'),
    }),
  });

  const defaultValues = {
    file: {
      url: '',
      size: 0,
      type: 'image/jpeg',
    },
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
            type="upload"
            name="file"
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

export default FilePopupForm;

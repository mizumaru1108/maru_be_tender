import * as Yup from 'yup';
import { Button, Stack, Typography } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadSingleFile } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import { styled } from '@mui/material/styles';

type FormValuesProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};
const LicenseInfoForm = ({ setStep }: Props) => {
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setStep((prevStep) => prevStep + 1);
  };
  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(-11),
  }));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={5}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFSelect name="اسم الجهة" label="تصنيف الجهة*">
            <option value="" disabled selected>
              الرجاء اختيار تصنيف الجهة
            </option>
          </RHFSelect>
          <RHFTextField
            name="الجهة المشرفة"
            label="رقم الترخيص*"
            placeholder="الرجاء اختيار الجهة المشرفة"
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFDatePicker name="اسم الجهة" label="تاريخ اصدار الترخيص*" />
          <RHFDatePicker name="المقر" label="تاريخ انتهاء الترخيص*" />
        </Stack>
        <LabelStyle>ملف الترخيص*</LabelStyle>
        <RHFUploadSingleFile name="firstName" placeholder="الرجاء اختيار ملف الترخيص" />
        <LabelStyle>ملف قرار تشكيل مجلس الإدارة*</LabelStyle>
        <RHFUploadSingleFile name="firstName" placeholder="ملف قرار تشكيل مجلس الإدارة" />
        <Stack direction="row" justifyContent="space-around" gap={2}>
          <Button
            onClick={() => {
              setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
            }}
            sx={{ color: '#000', size: 'large' }}
          >
            الرجوع
          </Button>
          <Button
            onClick={() => {
              setStep((prevStep) => (prevStep < 4 ? prevStep + 1 : prevStep));
            }}
            sx={{ backgroundColor: 'background.paper', color: '#fff' }}
          >
            التالي
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default LicenseInfoForm;

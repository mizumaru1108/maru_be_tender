import * as Yup from 'yup';
import { Button, Stack } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
const ConnectingInfoForm = ({ setStep }: Props) => {
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={5}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFSelect name="المنطقة*" label="المنطقة*">
            <option value="" disabled selected>
              الرجاء اختيار المنطقة
            </option>
          </RHFSelect>
          <RHFSelect name="المحافظة*" label="المحافظة*">
            <option value="" disabled selected>
              الرجاء اختيار المحافظة
            </option>
          </RHFSelect>
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFSelect name="مجال الجهة" label="المركز (الإدارة)*">
            <option value="" disabled selected>
              الرجاء اختيار المنطقة
            </option>
          </RHFSelect>
          <RHFTextField
            name="جوال الجهة*"
            label="جوال الجهة*"
            placeholder="الرجاء كتابة رقم الجوال"
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFTextField name="firstName" label="الهاتف" placeholder="الرجاء كتابة رقم الهاتف" />
          <RHFTextField
            name="firstName"
            label="حساب تويتر"
            placeholder="الرجاء ادخال رابط حساب التويتر"
          />
        </Stack>
        <RHFTextField
          name="firstName"
          label="الموقع الالكتروني*"
          placeholder="الرجاء ادخال رابط الموقع الإلكتروني"
        />
        <RHFTextField
          name="firstName"
          label="البريد الالكتروني*"
          placeholder="الرجاء ادخال البريد الالكتروني"
        />
        <RHFTextField name="firstName" label="كلمة السر*" placeholder="كلمة السر" />
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

export default ConnectingInfoForm;

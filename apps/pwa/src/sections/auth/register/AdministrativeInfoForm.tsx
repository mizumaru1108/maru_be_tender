import * as Yup from 'yup';
import { Button, Stack, Typography } from '@mui/material';
import {
  FormProvider,
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFUploadSingleFile,
} from 'components/hook-form';
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
const AdministrativeInfoForm = ({ setStep }: Props) => {
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
          <RHFTextField
            name="اسم الجهة"
            label="اسم المدير التنفيذي*"
            placeholder="الرجاء كتابة اسم المدير التنفيذي"
          />
          <RHFTextField
            name="الجهة المشرفة"
            label="جوال المدير التنفيذي*"
            placeholder="الرجاء كتابة رقم جوال المدير التنفيذي"
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFTextField
            name="اسم الجهة"
            label="اسم مدخل البيانات*"
            placeholder="الرجاء كتابة اسم مدخل البيانات"
          />
          <RHFTextField
            name="المقر"
            label="جوال مدخل البيانات*"
            placeholder="الرجاء ادخال البريد الالكتروني"
          />
        </Stack>
        <RHFTextField
          name="اسم الجهة"
          label="بريد مدخل البيانات*"
          placeholder="الرجاء كتابة رقم جوال مدخل البيانات"
        />
        <RHFCheckbox name="" label="أقر بصحة المعلومات الواردة" />
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

export default AdministrativeInfoForm;

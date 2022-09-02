import * as Yup from 'yup';
import { Button, Stack } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';

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
const MainForm = ({ setStep }: Props) => {
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
          <RHFSelect name="اسم الجهة" label="اسم الجهة*">
            <option value="" disabled selected>
              الرجاء اختيار اسم الجهة
            </option>
          </RHFSelect>
          <RHFSelect name="الجهة المشرفة" label="الجهة المشرفة*">
            <option value="" disabled selected>
              الرجاء اختيار الجهة المشرفة
            </option>
          </RHFSelect>
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFSelect name="مجال الجهة" label="مجال الجهة*">
            <option value="" disabled selected>
              الرجاء اختيار مجال الجهة
            </option>
          </RHFSelect>
          <RHFSelect name="المقر" label="المقر*">
            <option value="" disabled selected>
              الرجاء اختيار نوع المقر
            </option>
          </RHFSelect>
        </Stack>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <RHFTextField
            name="firstName"
            label="عدد الموظفين بدوام كلي للمنشأة"
            placeholder="عدد موظفين المنشأة"
          />
          <RHFTextField
            name="firstName"
            label="عدد المستفيدين من الجهة"
            placeholder="عدد المستفيدين من الجهة"
          />
          <RHFDatePicker name="firstName1" label="تاريخ التأسيس" placeholder="عصام" />
        </Stack>
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

export default MainForm;

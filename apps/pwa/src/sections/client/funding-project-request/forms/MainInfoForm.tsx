import * as Yup from 'yup';
import { useEffect } from 'react';
import { Button, Grid, Stack, Box } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import FormGenerator from 'components/FormGenerator';
import { MainFormData } from '../Forms-Data';
import { CustomFile } from 'components/upload';

type FormValuesProps = {
  project_name: string;
  project_idea: string;
  project_applying_place: string;
  project_applying_date: string;
  applying_duration: string;
  target_group_type: string;
  letter_support_request: CustomFile | string | null;
  project_attachments: CustomFile | string | null;
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const MainInfoForm = ({ setStep }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    project_name: Yup.string().required('Project name required'),
    project_idea: Yup.string().required('Project Idea name required'),
    project_applying_place: Yup.string().required('Project applying place is required'),
    project_applying_date: Yup.string().required('Project applying date is required'),
    applying_duration: Yup.string().required('Applying duration name required'),
    target_group_type: Yup.string().required('Target group type required'),
    letter_support_request: Yup.mixed().required('Letter support request is required'),
    project_attachments: Yup.mixed().required('Project attachments is required'),
  });
  const defaultValues = {
    project_name: '',
    project_idea: '',
    project_applying_place: '',
    project_applying_date: '',
    applying_duration: '',
    target_group_type: '',
    letter_support_request: undefined,
    project_attachments: undefined,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setStep((prevStep) => prevStep + 1);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={MainFormData} />
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center">
            <Box
              sx={{
                borderRadius: 2,
                height: '90px',
                backgroundColor: '#fff',
                padding: '24px',
              }}
            >
              <Stack justifyContent="center" direction="row" gap={3}>
                <Button
                  onClick={() => {
                    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
                  }}
                  endIcon={<MovingBack />}
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  رجوع
                </Button>
                <Box sx={{ width: '10px' }} />
                <Button
                  variant="outlined"
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                    borderColor: '#000',
                  }}
                >
                  حفظ كمسودة
                </Button>
                <Button
                  // type="submit"
                  onClick={() => {
                    setStep((prevStep) => (prevStep < 4 ? prevStep + 1 : prevStep));
                  }}
                  variant="outlined"
                  sx={{
                    backgroundColor: 'background.paper',
                    color: '#fff',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  التالي
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainInfoForm;

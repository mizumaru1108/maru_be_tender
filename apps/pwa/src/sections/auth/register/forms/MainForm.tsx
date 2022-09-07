import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import useLocales from 'hooks/useLocales';
import { MainValuesProps, Props, RegisterValues } from '../register-shared/register-types';

const MainForm = ({ setStep, setRegisterState }: Props) => {
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
    entity_area: Yup.string().required('Entity Area is required'),
    authority: Yup.string().required('Authority is required'),
    date_of_establishment: Yup.date().default(null).required('Date Of Establishment is required'),
    headquarters: Yup.string().required('Headquarters is required'),
    number_of_employees: Yup.number()
      .positive()
      .integer()
      .required('Number Of Employees is required'),
    number_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .required('Number Of Beneficiaries is required'),
  });

  const defaultValues = {
    entity_area: '',
    authority: '',
    date_of_establishment: '',
    headquarters: '',
    number_of_employees: undefined,
    number_of_beneficiaries: undefined,
  };

  const methods = useForm<MainValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: MainValuesProps) => {
    setRegisterState((prevRegisterState: RegisterValues) => ({ ...prevRegisterState, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  const entity_area = watch('entity_area');

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFSelect name="entity_area" label={translate('register_form1.entity_area.label')}>
            <option value="" disabled selected>
              {translate('register_form1.entity_area.placeholder')}
            </option>
            <option value="main">
              {translate('register_form1.entity_area.options.sub_entity_area')}
            </option>
            <option value="sub">
              {translate('register_form1.entity_area.options.main_entity_area')}
            </option>
          </RHFSelect>
        </Grid>
        {entity_area !== '' && (
          <>
            {entity_area === 'main' && (
              <Grid item md={12} xs={12}>
                <RHFSelect name="authority" label={translate('register_form1.authority.label')}>
                  <option value="" disabled selected>
                    {translate('register_form1.authority.placeholder')}
                  </option>
                </RHFSelect>
              </Grid>
            )}
            {entity_area === 'sub' && (
              <Grid item md={12} xs={12}>
                <RHFTextField
                  name="authority"
                  label={translate('register_form1.authority.label')}
                />{' '}
              </Grid>
            )}
          </>
        )}
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            name=""
            label={translate('register_form1.date_of_establishment.label')}
            placeholder={translate('register_form1.date_of_establishment.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect name="headquarters" label={translate('register_form1.headquarters.label')}>
            <option value="" disabled selected>
              {translate('register_form1.headquarters.placeholder')}
            </option>
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="number_of_employees"
            label={translate('register_form1.number_of_employees.label')}
            placeholder={translate('register_form1.number_of_employees.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="number_of_beneficiaries"
            label={translate('register_form1.number_of_beneficiaries.label')}
            placeholder={translate('register_form1.number_of_beneficiaries.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
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
              // type="submit"
              onClick={() => {
                setStep((prevStep) => prevStep + 1);
              }}
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
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainForm;

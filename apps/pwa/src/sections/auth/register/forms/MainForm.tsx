import * as Yup from 'yup';
import { Grid, MenuItem } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import useLocales from 'hooks/useLocales';
import { REGIONS } from 'sections/auth/register/RegisterFormData';
import { useEffect, useMemo } from 'react';
import { MainValuesProps } from '../../../../@types/register';
import BaseField from 'components/hook-form/BaseField';
import { AUTHORITY } from '_mock/authority';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: MainValuesProps;
};
const MainForm: React.FC<FormProps> = ({ children, onSubmit, defaultValues }) => {
  const { translate } = useLocales();
  const RegisterSchemaFirstForm = Yup.object().shape({
    entity: Yup.string().required(translate('errors.register.entity.required')),
    client_field: Yup.string().required(translate('errors.register.client_field.required')),
    authority: Yup.string().required(translate('errors.register.authority.required')),
    date_of_esthablistmen: Yup.date()
      .typeError(translate('errors.register.date_of_esthablistmen.required'))
      .default(null)
      .required(translate('errors.register.date_of_esthablistmen.required')),
    headquarters: Yup.string().required(translate('errors.register.headquarters.required')),
    num_of_employed_facility: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.register.num_of_employed_facility.min'))
      .required(translate('errors.register.num_of_employed_facility.required')),
    num_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.register.num_of_beneficiaries.min'))
      .required(translate('errors.register.num_of_beneficiaries.required')),
    // vat: Yup.boolean().required(),
  });

  const methods = useForm<MainValuesProps>({
    resolver: yupResolver(RegisterSchemaFirstForm),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = methods;

  const onSubmitForm = async (data: MainValuesProps) => {
    reset({ ...data });
    onSubmit(data);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  const client_field = watch('client_field');
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="entity"
            label={translate('register_form1.entity.label')}
            placeholder={translate('register_form1.entity.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFSelect
            name="client_field"
            label={translate('register_form1.entity_area.label')}
            placeholder={translate('register_form1.entity_area.placeholder')}
          >
            <MenuItem value="main">
              {translate('register_form1.entity_area.options.sub_entity_area')}
            </MenuItem>
            <MenuItem value="sub">
              {translate('register_form1.entity_area.options.main_entity_area')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        {client_field !== '' && client_field === 'main' && (
          <Grid item md={12} xs={12}>
            <RHFSelect
              name="authority"
              label={translate('register_form1.authority.label')}
              placeholder={translate('register_form1.authority.placeholder')}
            >
              {AUTHORITY.map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
        )}
        {client_field !== '' && client_field === 'sub' && (
          <Grid item md={12} xs={12}>
            <RHFTextField name="authority" label={translate('register_form1.authority.label')} />
          </Grid>
        )}
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            name="date_of_esthablistmen"
            label={translate('register_form1.date_of_establishment.label')}
            placeholder={translate('register_form1.date_of_establishment.placeholder')}
            InputProps={{
              inputProps: {
                max: new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0],
              },
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            name="headquarters"
            label={translate('register_form1.headquarters.label')}
            placeholder={translate('register_form1.headquarters.placeholder')}
          >
            {[
              'register_form1.headquarters.options.own',
              'register_form1.headquarters.options.rent',
            ].map((option, i) => (
              <MenuItem key={i} value={translate(option)}>
                {translate(option)}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="num_of_employed_facility"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            label={translate('register_form1.number_of_employees.label')}
            placeholder={translate('register_form1.number_of_employees.placeholder')}
            onKeyDown={(e) => {
              const prevent = ['e', 'E', '+', '-', '.', ','];
              prevent.includes(e.key) && e.preventDefault();
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(event) => {
              const newValue =
                event.target.value === '' || !event.target.value ? 0 : event.target.value;
              setValue('num_of_employed_facility', newValue as number);
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="num_of_beneficiaries"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            label={translate('register_form1.number_of_beneficiaries.label')}
            placeholder={translate('register_form1.number_of_beneficiaries.placeholder')}
            onKeyDown={(e) => {
              const prevent = ['e', 'E', '+', '-', '.', ','];
              prevent.includes(e.key) && e.preventDefault();
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(event) => {
              const newValue =
                event.target.value === '' || !event.target.value ? 0 : event.target.value;
              setValue('num_of_beneficiaries', newValue as number);
            }}
          />
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <BaseField
            type="checkbox"
            name="vat"
            label={translate('register_form1.vat.placeholder')}
          />
        </Grid> */}
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainForm;

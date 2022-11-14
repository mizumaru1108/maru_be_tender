import * as Yup from 'yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import useLocales from 'hooks/useLocales';
import { REGIONS } from 'sections/auth/register/RegisterFormData';
import { useEffect, useMemo } from 'react';
import { MainValuesProps } from '../../../../@types/register';
import BaseField from 'components/hook-form/BaseField';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: MainValuesProps;
};
const MainForm: React.FC<FormProps> = ({ children, onSubmit, defaultValues }) => {
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
    entity: Yup.string().required('Entity is required'),
    client_field: Yup.string().required('Client Field Area is required'),
    authority: Yup.string().required('Authority is required'),
    date_of_esthablistmen: Yup.date().default(null).required('Date Of Establishment is required'),
    headquarters: Yup.string().required('Headquarters is required'),
    num_of_employed_facility: Yup.number()
      .positive()
      .integer()
      .required('Number Of Employees is required'),
    num_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .required('Number Of Beneficiaries is required'),
    vat: Yup.boolean().required(),
  });

  const methods = useForm<MainValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmitForm = async (data: MainValuesProps) => {
    onSubmit(data);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  const client_field = watch('client_field');
  console.log(defaultValues);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFTextField name="entity" label="اسم الجهة" placeholder="الرجاء كتابة اسم الجهة" />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFSelect name="client_field" label={translate('register_form1.entity_area.label')}>
            <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
              {translate('register_form1.entity_area.placeholder')}
            </option>
            <option value="main" style={{ backgroundColor: '#fff' }}>
              {translate('register_form1.entity_area.options.sub_entity_area')}
            </option>
            <option value="sub" style={{ backgroundColor: '#fff' }}>
              {translate('register_form1.entity_area.options.main_entity_area')}
            </option>
          </RHFSelect>
        </Grid>
        {client_field !== '' && (
          <>
            {client_field === 'main' && (
              <Grid item md={12} xs={12}>
                <RHFSelect name="authority" label={translate('register_form1.authority.label')}>
                  <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                    {translate('register_form1.authority.placeholder')}
                  </option>
                  <option value="0" style={{ backgroundColor: '#fff' }}>
                    أخرى
                  </option>
                  <option value="1" style={{ backgroundColor: '#fff' }}>
                    المؤسسة العامة للتدريب التقني والمهني
                  </option>
                  <option value="2" style={{ backgroundColor: '#fff' }}>
                    هيئة الأوقاف
                  </option>
                  <option value="3" style={{ backgroundColor: '#fff' }}>
                    وزارة التجارة والاستثمار
                  </option>
                  <option value="4" style={{ backgroundColor: '#fff' }}>
                    وزارة التعليم
                  </option>
                  <option value="5" style={{ backgroundColor: '#fff' }}>
                    وزارة الشؤون الإسلامية
                  </option>
                  <option value="6" style={{ backgroundColor: '#fff' }}>
                    وزارة العدل
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الموارد البشرية والتنميةالاجتماعية
                  </option>
                </RHFSelect>
              </Grid>
            )}
            {client_field === 'sub' && (
              <Grid item md={12} xs={12}>
                <RHFTextField
                  name="authority"
                  label={translate('register_form1.authority.label')}
                />
              </Grid>
            )}
          </>
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
          <RHFSelect name="headquarters" label={translate('register_form1.headquarters.label')}>
            <>
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('register_form1.headquarters.placeholder')}
              </option>
              {['ملك', 'أجار'].map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="num_of_employed_facility"
            label={translate('register_form1.number_of_employees.label')}
            placeholder={translate('register_form1.number_of_employees.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="num_of_beneficiaries"
            label={translate('register_form1.number_of_beneficiaries.label')}
            placeholder={translate('register_form1.number_of_beneficiaries.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="checkbox"
            name="vat"
            label={translate('register_form1.vat.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainForm;

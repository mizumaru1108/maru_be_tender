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
      .required(translate('errors.register.num_of_employed_facility.required')),
    num_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .required(translate('errors.register.num_of_beneficiaries.required')),
    vat: Yup.boolean().required(),
  });

  const methods = useForm<MainValuesProps>({
    resolver: yupResolver(RegisterSchemaFirstForm),
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
                    وزارة النقل
                  </option>
                  <option value="2" style={{ backgroundColor: '#fff' }}>
                    وزارة الاقتصاد والتخطيط
                  </option>
                  <option value="3" style={{ backgroundColor: '#fff' }}>
                    وزارة الاتصالات وتقنية المعلومات
                  </option>
                  <option value="4" style={{ backgroundColor: '#fff' }}>
                    وزارة التعليم
                  </option>
                  <option value="5" style={{ backgroundColor: '#fff' }}>
                    وزارة الداخلية
                  </option>
                  <option value="6" style={{ backgroundColor: '#fff' }}>
                    وزارة العدل
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة التجارة والاستثمار
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الإعلام
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الطاقة
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة السياحة
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    الهئية العامة للأوقاف
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الصحة
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الرياضة
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الشؤون البلدية والقروية والإسكان
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة البيئة والمياه والزراعة
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    الهئية العامة للمعارض والمؤتمرات
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الصناعة والثروة المعدنية
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    الهئيئة السعودية للبيانات والذكاء الاصطناعي
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
              {[
                'register_form1.headquarters.options.own',
                'register_form1.headquarters.options.rent',
              ].map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {translate(item)}
                </option>
              ))}
              .options
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

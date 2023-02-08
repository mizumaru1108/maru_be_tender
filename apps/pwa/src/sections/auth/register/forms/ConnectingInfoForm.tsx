import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import RHFPassword from 'components/hook-form/RHFPassword';
import useLocales from 'hooks/useLocales';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { REGION } from '_mock/region';
import { RegionNames } from '../../../../@types/region';
import { ConnectingValuesProps } from '../../../../@types/register';
import BaseField from '../../../../components/hook-form/BaseField';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
  usedNumbers?: string[];
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues, usedNumbers }: FormProps) => {
  const tmpUsedNumbers: string[] = usedNumbers ?? [];
  // console.log('tmpUsedNumbers', tmpUsedNumbers);
  const { translate } = useLocales();

  useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    const newEntityMobile = defaultValues.entity_mobile?.replace('+966', '');
    const newPhone = defaultValues.phone?.replace('+966', '');
    newValues = { ...newValues, entity_mobile: newEntityMobile, phone: newPhone };
    if (!!newValues.entity_mobile) {
      reset(newValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  const phoneNumberValidation = Yup.string()
    .notRequired()
    .test('len', translate('errors.register.phone.length'), (val) => {
      if (val === undefined) {
        return true;
      }
      return val?.length === 0 || val!.length === 9;
    })
    .test('used', translate('errors.register.phone.exist'), (val) => {
      const isUsed = tmpUsedNumbers.includes(`+966${val ?? ''}`);
      return !isUsed;
    });
  const entityMobileValidation = Yup.string()
    .required(translate('errors.register.entity_mobile.required'))
    .test('len', translate('errors.register.entity_mobile.length'), (val) => {
      const isLength = val?.length === 9;
      return isLength;
    })
    .test('used', translate('errors.register.phone.exist'), (val) => {
      const isUsed = tmpUsedNumbers.includes(`+966${val ?? ''}`);
      return !isUsed;
    });
  const RegisterSchema = Yup.object().shape(
    {
      region: Yup.string().required(translate('errors.register.region.required')),
      governorate: Yup.string().required(translate('errors.register.governorate.required')),
      center_administration: Yup.string(),
      entity_mobile: entityMobileValidation.notOneOf(
        [Yup.ref('phone'), null],
        translate('errors.register.entity_mobile.equal')
      ),
      phone: phoneNumberValidation.notOneOf(
        [Yup.ref('entity_mobile'), null],
        translate('errors.register.phone.equal')
      ),
      twitter_acount: Yup.string(),
      website: Yup.string(),
      email: Yup.string()
        .email(translate('errors.register.email.email'))
        .required(translate('errors.register.email.required')),
      password: Yup.string().required(translate('errors.register.password.required')),
    },
    [
      // Add Cyclic deps here because when require itself
      ['phone', 'phone'],
    ]
  );

  const methods = useForm<ConnectingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
    getValues,
  } = methods;

  const onSubmitForm = async (data: ConnectingValuesProps) => {
    let newTmpNumbers: string[] = [...tmpUsedNumbers];

    let newEntityMobile = getValues('entity_mobile');
    let newPhoneValues = getValues('phone');

    newEntityMobile.substring(0, 4) !== '+966'
      ? (newEntityMobile = '+966'.concat(`${getValues('entity_mobile')}`))
      : (newEntityMobile = getValues('entity_mobile'));

    newPhoneValues!.substring(0, 4) !== '+966'
      ? (newPhoneValues = '+966'.concat(`${getValues('phone')}`))
      : (newPhoneValues = getValues('phone'));
    newTmpNumbers.push(newEntityMobile);
    newTmpNumbers.push(newPhoneValues!);
    const payload: ConnectingValuesProps = {
      ...data,
      phone: newPhoneValues!,
      entity_mobile: newEntityMobile!,
      used_numbers: [...newTmpNumbers],
    };
    // console.log('payload', payload);
    // reset({ ...payload });
    onSubmit(payload);
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   reset(defaultValues);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [defaultValues]);
  const region = watch('region') as RegionNames | '';
  // console.log('region', region);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={6} xs={12}>
          <BaseField
            type="selectWithoutGenerator"
            name="region"
            label="funding_project_request_form3.region.label"
            placeholder="funding_project_request_form3.region.placeholder"
          >
            <>
              {Object.keys(REGION).map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </BaseField>
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="selectWithoutGenerator"
            name="governorate"
            label="funding_project_request_form3.city.label"
            placeholder="funding_project_request_form3.city.placeholder"
          >
            {region !== '' && (
              <>
                {REGION[`${region}`].map((item: any, index: any) => (
                  <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </option>
                ))}
              </>
            )}
            {region === '' && (
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('funding_project_request_form3.city.placeholder')}
              </option>
            )}
          </BaseField>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="center_administration"
            label={translate('register_form2.center.label')}
            placeholder={translate('register_form2.region.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="entity_mobile"
            label={translate('register_form2.mobile_number.label')}
            // placeholder={translate('register_form2.mobile_number.placeholder')}
            placeholder="xxx xxx xxx"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="phone"
            label={translate('register_form2.phone.label')}
            // placeholder={translate('register_form2.phone.placeholder')}
            placeholder="xxx xxx xxx"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="twitter_acount"
            label={translate('register_form2.twitter.label')}
            placeholder={translate('register_form2.twitter.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="website"
            label={translate('register_form2.website.label')}
            placeholder={translate('register_form2.website.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="email"
            label="البريد الإلكتروني للجهة*"
            placeholder={translate('register_form2.email.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFPassword
            name="password"
            label={translate('register_form2.password.label')}
            placeholder={translate('register_form2.password.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;

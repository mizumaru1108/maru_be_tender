import * as React from 'react';
import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { AdministrativeInfoData } from '../RegisterFormData';
import { AdministrativeValuesProps } from '../../../../@types/register';
import useLocales from '../../../../hooks/useLocales';

type FormProps = {
  onReturn: () => void;
  onSubmit: (data: any) => void;
  defaultValues: AdministrativeValuesProps;
  done: boolean;
  usedNumbers?: string[];
};

const AdministrativeInfoForm = ({
  onSubmit,
  defaultValues,
  onReturn,
  done,
  usedNumbers,
}: FormProps) => {
  const tmpUsedNumbers: string[] = usedNumbers ?? [];
  console.log('tmpUsedNumbers', tmpUsedNumbers);
  const { translate } = useLocales();
  // const tmpUserNumbers = React.useMemo(() => {
  //   const { used_numbers } = defaultValues;
  //   return used_numbers && used_numbers.length > 0 ? [...used_numbers] : [];
  // }, [defaultValues]);
  const RegisterSchema = Yup.object().shape({
    ceo_name: Yup.string().required(translate('errors.register.ceo_name.required')),
    ceo_mobile: Yup.string()
      .required(translate('errors.register.ceo_mobile.length'))
      .test('len', translate('errors.register.ceo_mobile.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      })
      .test('used', translate('errors.register.phone.exist'), (val) => {
        const isUsed = tmpUsedNumbers.includes(`+966${val ?? ''}`);
        return !isUsed;
      }),
    chairman_name: Yup.string().required(translate('errors.register.chairman_name.required')),
    chairman_mobile: Yup.string()
      .required(translate('errors.register.chairman_mobile.length'))
      .test('len', translate('errors.register.chairman_mobile.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      })
      .test('used', translate('errors.register.phone.exist'), (val) => {
        const isUsed = tmpUsedNumbers.includes(`+966${val ?? ''}`);
        return !isUsed;
      }),
    data_entry_name: Yup.string().required(translate('errors.register.data_entry_name.required')),
    data_entry_mobile: Yup.string()
      .required(translate('errors.register.data_entry_mobile.length'))
      .test('len', translate('errors.register.data_entry_mobile.required'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      })
      .test('used', translate('errors.register.phone.exist'), (val) => {
        const isUsed = tmpUsedNumbers.includes(`+966${val ?? ''}`);
        return !isUsed;
      }),
    data_entry_mail: Yup.string()
      .email(translate('errors.register.email.email'))
      .required(translate('errors.register.email.required')),
    agree_on: Yup.boolean().required(translate('errors.register.agree_on.required')),
  });

  const methods = useForm<AdministrativeValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    getValues,
    reset,
  } = methods;

  const agree_on = watch('agree_on');
  const onSubmitForm = async (data: AdministrativeValuesProps) => {
    let newTmpNumbers: string[] = [...tmpUsedNumbers];
    let newCeoMobile = getValues('ceo_mobile');
    let newDataEntryMobile = getValues('data_entry_mobile');
    let newChairmanMobile = getValues('chairman_mobile');

    newCeoMobile.substring(0, 4) !== '+966'
      ? (newCeoMobile = '+966'.concat(`${getValues('ceo_mobile')}`))
      : (newCeoMobile = getValues('ceo_mobile'));

    newDataEntryMobile.substring(0, 4) !== '+966'
      ? (newDataEntryMobile = '+966'.concat(`${getValues('data_entry_mobile')}`))
      : (newDataEntryMobile = getValues('data_entry_mobile'));

    newChairmanMobile.substring(0, 4) !== '+966'
      ? (newChairmanMobile = '+966'.concat(`${getValues('chairman_mobile')}`))
      : (newChairmanMobile = getValues('chairman_mobile'));

    newTmpNumbers && newTmpNumbers.push(newCeoMobile);
    newTmpNumbers && newTmpNumbers.push(newDataEntryMobile);
    newTmpNumbers && newTmpNumbers.push(newChairmanMobile);
    const payload: AdministrativeValuesProps = {
      ...data,
      ceo_mobile: newCeoMobile!,
      data_entry_mobile: newDataEntryMobile!,
      chairman_mobile: newChairmanMobile!,
      used_numbers: [...newTmpNumbers],
    };
    console.log('payload', payload);
    // reset({ ...payload });
    onSubmit(payload);
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    const newCeoMobile = defaultValues.ceo_mobile?.replace('+966', '');
    const newDataEntryMobile = defaultValues.data_entry_mobile?.replace('+966', '');
    const newChairmanMobile = defaultValues.chairman_mobile?.replace('+966', '');
    newValues = {
      ...newValues,
      ceo_mobile: newCeoMobile,
      data_entry_mobile: newDataEntryMobile,
      chairman_mobile: newChairmanMobile,
    };
    // console.log('newValues', newValues);
    reset({ ...newValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={AdministrativeInfoData} />
        <Grid item md={12} xs={12}>
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                if (onReturn !== undefined) onReturn();
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
              type="submit"
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
              }}
              disabled={agree_on ? false : true}
            >
              {done ? 'تأكيد' : 'التالي'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AdministrativeInfoForm;

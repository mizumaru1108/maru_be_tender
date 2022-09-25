import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import useLocales from 'hooks/useLocales';
import { ContactSupportProps } from './types';
import RHFTextArea from 'components/hook-form/RHFTextArea';
// import { MainValuesProps, Props, RegisterValues } from '../register-shared/register-types';

const ContactSupportForm = () => {
  const { translate } = useLocales();
  const supportSchema = Yup.object().shape({
    type: Yup.string().required('Entity Area is required'),
    message_title: Yup.string().required('Authority is required'),
    message: Yup.string().required('Date Of Establishment is required'),
    project_name: Yup.string().required('Date Of Establishment is required'),
    appointmentDate: Yup.string().required('Date Of Establishment is required'),
    appointmentCause: Yup.string().required('Date Of Establishment is required'),
  });

  const defaultValues = {
    type: '',
    title: '',
    message_title: '',
    project_name: '',
    appointmentDate: '',
    appointmentCause: '',
  };

  const methods = useForm<ContactSupportProps>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const type = watch('type');
  const onSubmit = async () => {};
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFSelect name="type" label={translate('contact_support_form.inquiry_type.label')}>
            <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
              {translate('contact_support_form.inquiry_type.placeholder')}
            </option>
            <option value="general_inquiry" style={{ backgroundColor: '#fff' }}>
              {translate('contact_support_form.inquiry_type.options.general_inquiry')}
            </option>
            <option value="project_inquiry" style={{ backgroundColor: '#fff' }}>
              {translate('contact_support_form.inquiry_type.options.project_inquiry')}
            </option>
            <option value="appointment_inquiry" style={{ backgroundColor: '#fff' }}>
              {translate('contact_support_form.inquiry_type.options.appointment_inquiry')}
            </option>
          </RHFSelect>
        </Grid>
        {type === 'general_inquiry' && (
          <>
            <Grid item md={12} xs={12}>
              <RHFTextField
                name="title"
                label={translate('contact_support_form.message_title.label')}
                placeholder={translate('contact_support_form.message_title.placeholder')}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <RHFTextArea
                name="message"
                label={translate('contact_support_form.message.label')}
                placeholder={translate('contact_support_form.message.placeholder')}
              />
            </Grid>
          </>
        )}
        {type === 'project_inquiry' && (
          <>
            <Grid item md={6} xs={12}>
              <RHFSelect
                name="project_name"
                label={translate('contact_support_form.project_name.label')}
              >
                <option value="" disabled selected>
                  {translate('contact_support_form.project_name.placeholder')}
                </option>
              </RHFSelect>
            </Grid>
            <Grid item md={6} xs={12}>
              <RHFTextField
                name="title"
                label={translate('contact_support_form.message_title.label')}
                placeholder={translate('contact_support_form.message_title.placeholder')}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <RHFTextArea
                name="message"
                label={translate('contact_support_form.message.label')}
                placeholder={translate('contact_support_form.message.placeholder')}
              />
            </Grid>
          </>
        )}
        {type === 'appointment_inquiry' && (
          <>
            <Grid item md={12} xs={12}>
              <RHFDatePicker
                name="appointmentDate"
                label={translate('contact_support_form.appointment_date.label')}
                placeholder={translate('contact_support_form.appointment_date.placeholder')}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <RHFTextArea
                name="message"
                label={translate('contact_support_form.message.label')}
                placeholder={translate('contact_support_form.message.placeholder')}
              />
            </Grid>
          </>
        )}
        <Grid item md={12} xs={12}>
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                console.log('');
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
            >
              ارسال
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ContactSupportForm;

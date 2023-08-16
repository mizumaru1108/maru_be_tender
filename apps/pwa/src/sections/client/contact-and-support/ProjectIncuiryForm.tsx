import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, MenuItem, TextField } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from '../../../components/hook-form/BaseField';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import { ContactUsInquiry } from './types';
interface Props {
  children?: React.ReactNode;
  defaultValuesForm?: ContactUsInquiry;
  onSubmitForm: (data: ContactUsInquiry) => void;
  loading: boolean;
}

const ProjectIncuiryForm = ({ onSubmitForm, defaultValuesForm, children, loading }: Props) => {
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();
  const tmpUser: any = { ...user };
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    const url = `/tender/client/proposals?user_id=${tmpUser.id}`;
    try {
      const response = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      console.log('test data:', response.data);
    } catch (err) {
      setError(true);
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  const supportSchema = Yup.object().shape({
    proposal_id: Yup.string().required(
      translate('contact_support_form.errors.proposal_id.required')
    ),
    title: Yup.string().required(translate('contact_support_form.errors.title.required')),
    message: Yup.string().required(translate('contact_support_form.errors.message.required')),
  });

  const defaultValues = {
    title: defaultValuesForm?.title || '',
    message: defaultValuesForm?.message || '',
    proposal_id: defaultValuesForm?.proposal_id || '',
  };
  const methods = useForm<ContactUsInquiry>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const inquiry_type = watch('inquiry_type');
  const onSubmit = async (data: ContactUsInquiry) => {
    // console.log('data', data);
    onSubmitForm(data);
  };

  React.useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{translate('pages.common.error')}</>;

  // console.log('formType', formType);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={6} xs={12}>
            {/* <RHFSelect
              name="proposal_id"
              label={translate('contact_support_form.project_name.label')}
            >
              <option value="" disabled selected>
                {translate('contact_support_form.project_name.placeholder')}
              </option>
            </RHFSelect> */}
            <BaseField
              type="select"
              name="proposal_id"
              label={translate('contact_support_form.proposal.label')}
              data-cy="contact_support_form.proposal"
              placeholder={translate('contact_support_form.proposal.placeholder')}
              disabled={loading}
            >
              <MenuItem value="test">test</MenuItem>
            </BaseField>
          </Grid>
          <Grid item md={6} xs={12}>
            <BaseField
              type="textField"
              name="title"
              label={translate('contact_support_form.message_title.label')}
              data-cy="contact_support_form.message_title"
              placeholder={translate('contact_support_form.message_title.placeholder')}
              disabled={loading}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <BaseField
              type="textArea"
              name="message"
              label={translate('contact_support_form.message.label')}
              data-cy="contact_support_form.message"
              placeholder={translate('contact_support_form.message.placeholder')}
              disabled={loading}
            />
          </Grid>
          {children}
        </Grid>
      </FormProvider>
    </>
  );
};

export default ProjectIncuiryForm;

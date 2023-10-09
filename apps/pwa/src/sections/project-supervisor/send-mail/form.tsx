import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import RHFComboBox, { ComboBoxOption } from 'components/hook-form/RHFComboBox';
// import { useListState, randomId } from '@mantine/hooks';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
import { BaseAttachement } from '../../../@types/proposal';
import BaseField from '../../../components/hook-form/BaseField';

interface FormSendEmail {
  is_association: string;
  receiver_name: ComboBoxOption | string;
  receiver_email: string;
  email_subject: string;
  email_content: string;
  email_attachment: BaseAttachement | string;
}

interface Props {
  children?: React.ReactNode;
  onSubmitForm: (data: FormSendEmail) => void;
}

export default function SendEmailForm(props: Props) {
  const { children, onSubmitForm } = props;

  const { translate } = useLocales();

  const { client_list, loadingProps } = useSelector((state) => state.proposal);

  const initialValues: FormSendEmail = useMemo(() => {
    const tmpValues: FormSendEmail = {
      email_attachment: {
        size: undefined,
        type: '',
        url: '',
      },
      email_content: '',
      email_subject: '',
      is_association: 'true',
      receiver_email: '',
      receiver_name: {
        label: '',
        value: '',
      },
    };
    return tmpValues;
  }, []);

  const supportSchema = Yup.object().shape({
    receiver_name: Yup.string().required(
      translate('email_to_client.errors.receiver_name.required')
    ),
    receiver_email: Yup.string().required(
      translate('email_to_client.errors.receiver_email.required')
    ),
    email_subject: Yup.string().required(
      translate('email_to_client.errors.email_subject.required')
    ),
    email_content: Yup.string().required(
      translate('email_to_client.errors.email_content.required')
    ),
    email_attachment: Yup.mixed()
      .test('size', translate('email_to_client.errors.attachments.fileSize'), (value) => {
        if (value) {
          if (value.size > 1024 * 1024 * 200) {
            return false;
          }
        }
        return true;
      })
      .test(
        'fileExtension',
        translate('email_to_client.errors.attachments.fileExtension'),
        (value) => {
          if (value) {
            if (value.fileExtension && value.fileExtension !== 'application/pdf') {
              return false;
            } else if (value.type && value.type !== 'application/pdf') {
              return false;
            }
          }
          return true;
        }
      ),
  });

  const methods = useForm<FormSendEmail>({
    resolver: yupResolver(supportSchema),
    defaultValues: initialValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchIsAssociation = watch('is_association');
  const watchName = watch('receiver_name');

  useEffect(() => {
    if (watchIsAssociation && watchIsAssociation === 'true') {
      if ((watchName as ComboBoxOption)?.value !== '' && client_list?.length > 0) {
        const { value } = watchName as ComboBoxOption;
        const tmpEmail = client_list.find((item) => item.id === value)?.email;
        if (tmpEmail) {
          setValue('receiver_email', tmpEmail);
        }
      }
    }
  }, [watchName, setValue, client_list, watchIsAssociation]);

  const onSubmit = async (data: FormSendEmail) => {
    // console.log('data', data);
    onSubmitForm(data);
  };

  if (loadingProps?.laodingClient) return <>{translate('pages.common.loading')}</>;

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={12} xs={12}>
            <BaseField
              type="radioGroup"
              name="is_association"
              label={translate('email_to_client.fields.is_association.label')}
              placeholder={translate('email_to_client.fields.is_association.placeholder')}
              options={[
                {
                  label: translate('email_to_client.fields.is_association.option.yes'),
                  value: true,
                },
                {
                  label: translate('email_to_client.fields.is_association.option.no'),
                  value: false,
                },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            {watchIsAssociation && watchIsAssociation === 'true' ? (
              <RHFComboBox
                isMultiple={false}
                disabled={loadingProps.laodingClient}
                name="receiver_name"
                label={translate('portal_report.partner_name.label')}
                placeholder={translate('portal_report.partner_name.placeholder')}
                dataOption={
                  client_list.length > 0
                    ? client_list.map((client) => ({
                        label: client.employee_name,
                        value: client.id,
                      }))
                    : []
                }
              />
            ) : (
              <RHFTextField
                name={`receiver_name`}
                label={translate('email_to_client.fields.receiver_email.label')}
                placeholder={translate('email_to_client.fields.receiver_email.placeholder')}
              />
            )}
          </Grid>
          <Grid item md={6} xs={12} sx={{ padding: '0 7px' }}>
            <RHFTextField
              name={`receiver_email`}
              label={translate('email_to_client.fields.receiver_email.label')}
              placeholder={translate('email_to_client.fields.receiver_email.placeholder')}
            />
          </Grid>
        </Grid>
        {children}
      </FormProvider>
    </>
  );
}

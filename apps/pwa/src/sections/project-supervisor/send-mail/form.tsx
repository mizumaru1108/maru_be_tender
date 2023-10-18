import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import RHFComboBox, { ComboBoxOption } from 'components/hook-form/RHFComboBox';
import { RHFUploadSingleFileBe } from 'components/hook-form/RHFUploadBe';
// import { useListState, randomId } from '@mantine/hooks';
import RHFRichText from 'components/hook-form/RHFRichText';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
import { BaseAttachement } from '../../../@types/proposal';
import BaseField from '../../../components/hook-form/BaseField';

export type FormSendEmail = {
  user_on_app: string;
  receiver_name: ComboBoxOption | string;
  receiver_email: string;
  title: string;
  content: string;
  attachments: BaseAttachement;
};

interface Props {
  children?: React.ReactNode;
  onSubmitForm: (data: FormSendEmail) => void;
  isLoading: boolean;
}

export default function SendEmailForm(props: Props) {
  const { children, onSubmitForm, isLoading } = props;

  const { translate } = useLocales();
  const { client_list, loadingProps } = useSelector((state) => state.proposal);

  const [valueTextEditor, setValueTextEditor] = useState('');
  // console.log({ valueTextEditor });

  const initialValues: FormSendEmail = useMemo(() => {
    const tmpValues: FormSendEmail = {
      attachments: {
        size: undefined,
        type: '',
        url: '',
        fileExtension: '',
      },
      content: '',
      title: '',
      user_on_app: '0',
      receiver_email: '',
      receiver_name: {
        label: '',
        value: '',
      },
    };
    return tmpValues;
  }, []);

  const supportSchema = Yup.object().shape({
    receiver_name: Yup.mixed().test(
      'value',
      translate('email_to_client.errors.receiver_name.required'),
      (value) => {
        if (value?.label === '') {
          return false;
        } else if (value === '') {
          return false;
        } else {
          return true;
        }
      }
    ),
    receiver_email: Yup.string()
      .required(translate('email_to_client.errors.receiver_email.required'))
      .email(translate('email_to_client.errors.receiver_email.wrong_format')),
    title: Yup.string().required(translate('email_to_client.errors.email_subject.required')),
    content: Yup.mixed().test(
      'value',
      translate('email_to_client.errors.email_content.required'),
      (value) => {
        if (value === '') {
          return false;
        } else if (value === '<p><br></p>') {
          return false;
        } else {
          return true;
        }
      }
    ),
    attachments: Yup.mixed()
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
            } else if (value?.fileExtension === '' || value.type === '') {
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
    formState: { isSubmitting },
  } = methods;

  const watchIsAssociation = watch('user_on_app');
  const watchName = watch('receiver_name');

  useEffect(() => {
    if (watchIsAssociation && watchIsAssociation === '0') {
      if ((watchName as ComboBoxOption)?.value !== '' && client_list?.length > 0) {
        const { value } = watchName as ComboBoxOption;
        const tmpEmail = client_list.find((item) => item.id === value)?.email;
        if (tmpEmail) {
          setValue('receiver_email', tmpEmail);
        }
      }
    }
  }, [watchName, setValue, client_list, watchIsAssociation]);

  useEffect(() => {
    if (watchIsAssociation && watchIsAssociation === '0') {
      setValue('receiver_name', {
        label: '',
        value: '',
      });
    } else {
      setValue('receiver_name', '');
    }
    setValue('receiver_email', '');
  }, [watchIsAssociation, setValue]);

  const onSubmit = async (data: FormSendEmail) => {
    // console.log('data', data.attachments);
    onSubmitForm({
      ...data,
      attachments: data.attachments,
    });
  };

  if (loadingProps?.laodingClient) return <>{translate('pages.common.loading')}</>;

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={12} xs={12}>
            <BaseField
              type="radioGroup"
              name="user_on_app"
              label={translate('email_to_client.fields.is_association.label')}
              placeholder={translate('email_to_client.fields.is_association.placeholder')}
              options={[
                {
                  label: translate('email_to_client.fields.is_association.option.yes'),
                  value: '0',
                },
                {
                  label: translate('email_to_client.fields.is_association.option.no'),
                  value: '1',
                },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            {watchIsAssociation && watchIsAssociation === '0' ? (
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
              disabled={watchIsAssociation && watchIsAssociation === '0' ? true : false}
              name={`receiver_email`}
              label={translate('email_to_client.fields.receiver_email.label')}
              placeholder={translate('email_to_client.fields.receiver_email.placeholder')}
            />
          </Grid>
          <Grid item md={12} xs={12} sx={{ padding: '0 7px' }}>
            <RHFTextField
              name={`title`}
              label={translate('email_to_client.fields.email_subject.label')}
              placeholder={translate('email_to_client.fields.email_subject.placeholder')}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <BaseField
              type="uploadLabel"
              label={translate('email_to_client.fields.email_content.label')}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <RHFRichText
              name="content"
              placeholder={translate('email_to_client.fields.email_content.placeholder')}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <BaseField
              type="uploadLabel"
              label={translate('email_to_client.fields.email_attachment.label')}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <RHFUploadSingleFileBe
              name="attachments"
              placeholder={translate('email_to_client.fields.email_attachment.placeholder')}
            />
          </Grid>
        </Grid>
        {children}
      </FormProvider>
    </>
  );
}

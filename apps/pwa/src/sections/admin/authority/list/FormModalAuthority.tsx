// @mui
import { Button, Grid, MenuItem, Stack, Typography, TextField } from '@mui/material';
// component
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
// hooks
import useLocales from 'hooks/useLocales';
//
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { formatCapitalizeText } from '../../../../utils/formatCapitalizeText';
import { AuthorityInterface, ClientFieldInterface } from './types';

// --------------------------------------------------------------------------------------------------

type Props = {
  clientFieldList: ClientFieldInterface[];
  type: 'add' | 'edit' | 'delete';
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleSubmitProps: (data: ISubmit) => void;
  formDefaultValue?: AuthorityInterface;
};

type ISubmit = {
  authority_id?: string | string[];
  client_field_id?: string;
  name?: string;
  is_deleted?: boolean;
};

// --------------------------------------------------------------------------------------------------

function FormModalAuthority({
  clientFieldList,
  type,
  loading,
  open,
  handleClose,
  handleSubmitProps,
  formDefaultValue,
}: Props) {
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(translate('pages.admin.settings.label.form.bank_name.required')),
  });

  const [clientFieldId, setClientFieldId] = React.useState<string>(
    formDefaultValue?.client_field_id || ''
  );

  const defaultValues = {
    authority_id: '',
    name: '',
    client_field_id: '',
    is_deleted: false,
  };

  const methods = useForm<AuthorityInterface>({
    resolver: yupResolver(validationSchema),
    defaultValues: type === 'edit' && formDefaultValue ? formDefaultValue : defaultValues,
  });

  const { handleSubmit, reset, watch } = methods;

  const onSubmitForm = (formValue: AuthorityInterface) => {
    let newValue: ISubmit = {};

    if (type === 'add') {
      newValue.client_field_id = clientFieldId;
      newValue.name = formValue.name;
    }

    if (type === 'edit') {
      newValue = { ...formValue };
      newValue.authority_id = formValue.authority_id;
    }

    if (type === 'delete') {
      newValue.authority_id = [formValue.authority_id];
    }
    // console.log({ newValue });
    handleSubmitProps(newValue);
  };

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        isOpen={open}
        onClose={() => {
          reset({
            authority_id: type !== 'add' && formDefaultValue ? formDefaultValue.authority_id : '',
            client_field_id:
              type !== 'add' && formDefaultValue ? formDefaultValue.client_field_id : '',
            name: type !== 'add' && formDefaultValue ? formDefaultValue.name : '',
            is_deleted: type !== 'add' && formDefaultValue ? formDefaultValue.is_deleted : false,
          });

          handleClose();
        }}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        showCloseIcon={true}
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {translate(
                `pages.admin.settings.label.modal.${
                  type === 'add'
                    ? 'add_authorities'
                    : type === 'edit'
                    ? 'edit_authorities'
                    : type === 'delete'
                    ? 'delete_authorities'
                    : 'add_authorities'
                }`
              )}
            </Typography>
          </Stack>
        }
        content={
          <>
            {type !== 'delete' ? (
              <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
                <Grid item md={12} xs={12}>
                  <RHFTextField
                    type="text"
                    name="name"
                    label={translate('pages.admin.settings.label.form.authorities.label.name')}
                    placeholder={translate(
                      'pages.admin.settings.label.form.authorities.placeholder.name'
                    )}
                    size="small"
                    disabled={loading}
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <TextField
                    name="client_field_id"
                    select
                    value={clientFieldId}
                    label={translate('system_messages.filter.track.label')}
                    placeholder={translate('system_messages.filter.track.label')}
                    onChange={(e) => {
                      e.target.value !== ''
                        ? setClientFieldId(e.target.value)
                        : setClientFieldId('');
                    }}
                    size="small"
                    sx={{ fontSize: '14px', width: '100%', color: '#000' }}
                  >
                    {clientFieldList.map((item, index) => (
                      <MenuItem key={index} value={item.client_field_id}>
                        {formatCapitalizeText(item.name)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            ) : (
              <Typography>
                {translate('pages.admin.settings.label.form.authorities.confirmation.delete')}{' '}
                <span style={{ fontWeight: 700 }}>{`${formatCapitalizeText(watch('name'))}`}</span>?
              </Typography>
            )}
          </>
        }
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                reset({
                  authority_id:
                    type !== 'add' && formDefaultValue ? formDefaultValue.authority_id : '',
                  client_field_id:
                    type !== 'add' && formDefaultValue ? formDefaultValue.client_field_id : '',
                  name: type !== 'add' && formDefaultValue ? formDefaultValue.name : '',
                  is_deleted:
                    type !== 'add' && formDefaultValue ? formDefaultValue.is_deleted : false,
                });

                handleClose();
              }}
              size="large"
              color="inherit"
              variant="contained"
              disabled={loading}
            >
              {translate('finance_pages.button.back')}
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              size="large"
              // color="primary"
              color={type === 'delete' ? 'error' : 'primary'}
            >
              {/* {type !== 'edit'
                ? translate('add')
                : translate('pages.admin.settings.label.table.modify')} */}
              {type === 'add'
                ? translate('add')
                : type === 'edit'
                ? translate('pages.admin.settings.label.table.modify')
                : type === 'delete'
                ? translate('button.delete')
                : ''}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default FormModalAuthority;

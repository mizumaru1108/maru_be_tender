// @mui
import { Grid, Stack, Typography, Button, Box } from '@mui/material';
// component
import { FormProvider, RHFTextField } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
import { LoadingButton } from '@mui/lab';
// hooks
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
//
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// --------------------------------------------------------------------------------------------------

export interface FormInput {
  id?: string;
  bank_name: string;
}

type Props = {
  type: string;
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleSubmitProps: (data: FormInput) => void;
  formDefaultValue?: FormInput;
};

// --------------------------------------------------------------------------------------------------

function FormModalBank({
  type,
  loading,
  open,
  handleClose,
  handleSubmitProps,
  formDefaultValue,
}: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  const validationSchema = Yup.object().shape({
    bank_name: Yup.string().required(
      translate('pages.admin.settings.label.form.bank_name.required')
    ),
  });

  const defaultValues = {
    bank_name: '',
  };

  const methods = useForm<FormInput>({
    resolver: yupResolver(validationSchema),
    defaultValues: type === 'edit' && formDefaultValue ? formDefaultValue : defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmitForm = (formValue: FormInput) => {
    handleSubmitProps(formValue);
  };

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        isOpen={open}
        onClose={() => {
          reset({
            id: type === 'edit' && formDefaultValue ? formDefaultValue.id : '',
            bank_name: type === 'edit' && formDefaultValue ? formDefaultValue.bank_name : '',
          });

          handleClose();
        }}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        showCloseIcon={true}
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {translate(
                `pages.admin.settings.label.modal.${type === 'edit' ? 'edit_bank' : 'add_new_bank'}`
              )}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFTextField
                type="text"
                name="bank_name"
                label={translate('pages.admin.settings.label.form.bank_name.label')}
                placeholder={translate('pages.admin.settings.label.form.bank_name.placeholder')}
                size="small"
                disabled={loading}
              />
            </Grid>
          </Grid>
        }
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                reset({
                  id: type === 'edit' && formDefaultValue ? formDefaultValue.id : '',
                  bank_name: type === 'edit' && formDefaultValue ? formDefaultValue.bank_name : '',
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
              color="primary"
            >
              {type !== 'edit'
                ? translate('add')
                : translate('pages.admin.settings.label.table.modify')}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default FormModalBank;

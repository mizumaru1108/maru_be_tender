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
import { IBeneficiaries } from 'sections/admin/beneficiaries/list/types';
import { IRegions } from 'sections/admin/region/list/types';

// --------------------------------------------------------------------------------------------------

type Props = {
  type: string;
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleSubmitProps: (data: ISubmit) => void;
  formDefaultValue?: IRegions;
};

type ISubmit = {
  region_id?: string;
  name?: string;
  is_deleted?: boolean;
};

// --------------------------------------------------------------------------------------------------

function FormModalRegions({
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
    name: Yup.string().required(
      translate('pages.admin.settings.label.regions.form.region_name.required')
    ),
  });

  const defaultValues = {
    region_id: '',
    name: '',
    is_deleted: false,
  };

  const methods = useForm<IRegions>({
    resolver: yupResolver(validationSchema),
    defaultValues: type === 'edit' && formDefaultValue ? formDefaultValue : defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmitForm = (formValue: IRegions) => {
    const newValue: ISubmit = { ...formValue };
    if (type !== 'edit') {
      delete newValue.region_id;
      delete newValue.is_deleted;
    }
    // console.log({ newValue, formDefaultValue });
    handleSubmitProps(newValue);
  };

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        isOpen={open}
        onClose={() => {
          reset({
            region_id: type === 'edit' && formDefaultValue ? formDefaultValue.region_id : '',
            name: type === 'edit' && formDefaultValue ? formDefaultValue.name : '',
            is_deleted: type === 'edit' && formDefaultValue ? formDefaultValue.is_deleted : false,
          });

          handleClose();
        }}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        showCloseIcon={true}
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {translate(
                `pages.admin.settings.label.regions.modal.${
                  type === 'edit' ? 'edit_regions' : 'add_regions'
                }`
              )}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFTextField
                data-cy="pages.admin.settings.label.regions.form.regions.label"
                type="text"
                name="name"
                label={translate('pages.admin.settings.label.regions.form.regions.label')}
                placeholder={translate(
                  'pages.admin.settings.label.regions.form.regions.placeholder'
                )}
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
                  region_id: type === 'edit' && formDefaultValue ? formDefaultValue.region_id : '',
                  name: type === 'edit' && formDefaultValue ? formDefaultValue.name : '',
                  is_deleted:
                    type === 'edit' && formDefaultValue ? formDefaultValue.is_deleted : false,
                });

                handleClose();
              }}
              size="large"
              color="inherit"
              variant="contained"
              disabled={loading}
              data-cy="finance_pages.button.back"
            >
              {translate('finance_pages.button.back')}
            </Button>
            <LoadingButton
              data-cy="pages.admin.settings.label.table.modify"
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

export default FormModalRegions;

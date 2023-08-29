// @mui
import { Button, Grid, MenuItem, Stack, Typography } from '@mui/material';
// component
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
//
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { GovernorateFormInput, IGovernorate } from 'sections/admin/governorate/list/types';
import * as Yup from 'yup';
import { IRegions } from 'sections/admin/region/list/types';

// --------------------------------------------------------------------------------------------------

type Props = {
  type: string;
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleSubmitProps: (data: GovernorateFormInput) => void;
  formDefaultValue?: IGovernorate;
  regionList: IRegions[];
};

// --------------------------------------------------------------------------------------------------

function FormModalGovernorates({
  type,
  loading,
  open,
  handleClose,
  handleSubmitProps,
  formDefaultValue,
  regionList,
}: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  // console.log({ regionList });
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      translate('pages.admin.settings.label.governorate.form.governorate_name.required')
    ),
    region_id: Yup.string().required(
      translate('pages.admin.settings.label.governorate.form.region_id.required')
    ),
  });

  const defaultValues: GovernorateFormInput = {
    governorate_id: '',
    region_id: '',
    name: '',
    is_deleted: false,
  };

  const methods = useForm<IGovernorate>({
    resolver: yupResolver(validationSchema),
    defaultValues: type === 'edit' && formDefaultValue ? formDefaultValue : defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmitForm = (formValue: IGovernorate) => {
    const newValue: GovernorateFormInput = { ...formValue };
    if (type !== 'edit') {
      delete newValue.governorate_id;
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
            governorate_id:
              type === 'edit' && formDefaultValue ? formDefaultValue.governorate_id : '',
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
                `pages.admin.settings.label.governorate.modal.${
                  type === 'edit' ? 'edit_governorate' : 'add_governorate'
                }`
              )}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFTextField
                data-cy="pages.admin.settings.label.governorate.form.governorate.label"
                type="text"
                name="name"
                label={translate('pages.admin.settings.label.governorate.form.governorate.label')}
                placeholder={translate(
                  'pages.admin.settings.label.governorate.form.governorate.placeholder'
                )}
                size="small"
                disabled={loading}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <RHFSelect
                disabled={loading || regionList.length === 0}
                type="select"
                name="region_id"
                data-cy={translate('pages.admin.settings.label.governorate.form.region_id.label')}
                label={translate('pages.admin.settings.label.governorate.form.region_id.label')}
                placeholder={translate(
                  'pages.admin.settings.label.governorate.form.region_id.placeholder'
                )}
                size="small"
              >
                {[...regionList]
                  .filter((item) => item.is_deleted === false)
                  .map((option, index) => (
                    <MenuItem
                      data-cy={`pages.admin.settings.label.governorate.form.region_id.option-${index}`}
                      key={option.region_id}
                      value={option.region_id}
                    >
                      {translate(option.name)}
                    </MenuItem>
                  ))}
              </RHFSelect>
            </Grid>
          </Grid>
        }
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                reset({
                  governorate_id:
                    type === 'edit' && formDefaultValue ? formDefaultValue.governorate_id : '',
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

export default FormModalGovernorates;

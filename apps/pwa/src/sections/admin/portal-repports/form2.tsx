import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid } from '@mui/material';
import { FormProvider, RHFMultiCheckbox } from 'components/hook-form';
import { ComboBoxOption } from 'components/hook-form/RHFComboBox';
import useLocales from 'hooks/useLocales';
import { useForm } from 'react-hook-form';
import { SelectedColumnOptions } from 'sections/admin/portal-repports/options';
import * as Yup from 'yup';
import ReplayIcon from '@mui/icons-material/Replay';
import React from 'react';

// -----------------------------------------------------------------------------
export interface FormValuesPortalReport2 {
  selected_columns: string[];
}
interface Props {
  children?: React.ReactNode;
  onSubmitForm: (data: FormValuesPortalReport2) => void;
  defaultValuesForm?: FormValuesPortalReport2;
  isLoading: boolean;
}
// -----------------------------------------------------------------------------
export default function PortalReportsForm2({
  children,
  isLoading,
  defaultValuesForm,
  onSubmitForm,
}: Props) {
  const { translate } = useLocales();
  const supportSchema = Yup.object().shape({
    selected_columns: Yup.array().min(
      1,
      translate('portal_report.errors.selected_columns.required')
    ),
  });

  const defaultValues = {
    selected_columns: [],
  };
  const methods = useForm<FormValuesPortalReport2>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchSelectedColumns = watch('selected_columns');
  // console.log({ watchSelectedColumns, defaultValuesForm });

  const onSubmit = async (data: FormValuesPortalReport2) => {
    // console.log('data', data);
    onSubmitForm(data);
  };

  React.useEffect(() => {
    if (defaultValuesForm) {
      reset(defaultValuesForm);
      // setValue('partner_name', defaultValuesForm.partner_name);
    }
  }, [defaultValuesForm, reset]);

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={12} xs={12}>
            <RHFMultiCheckbox
              disabled={watchSelectedColumns.length === 7}
              name="selected_columns"
              label={translate('portal_report.selected_columns.label')}
              data-cy="portal_report.selected_columns"
              placeholder={translate('portal_report.selected_columns.placeholder')}
              gridCol={3}
              options={SelectedColumnOptions}
              onErrorCapture={(error) => {
                console.log('error', error);
              }}
            />
            {watchSelectedColumns.length === 7 ? (
              <Button
                disabled={watchSelectedColumns.length !== 7}
                data-cy={`button-retry-fetching-bank`}
                variant="outlined"
                color="error"
                onClick={() => {
                  reset({
                    selected_columns: [],
                  });
                }}
                endIcon={<ReplayIcon />}
                sx={{ marginTop: 2 }}
              >
                {translate('notification.clear_all')}
              </Button>
            ) : null}
          </Grid>
        </Grid>
        {children}
      </FormProvider>
    </div>
  );
}

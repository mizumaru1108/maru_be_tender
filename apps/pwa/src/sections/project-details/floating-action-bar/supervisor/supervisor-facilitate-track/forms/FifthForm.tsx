import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, TextField, IconButton, Button } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import FormGenerator from 'components/FormGenerator';
import { FifthFormData } from './form-data';
import { SupervisorStep5 } from '../../../../../../@types/supervisor-accepting-form';
import { useSelector } from 'redux/store';
//
import useLocales from 'hooks/useLocales';
import CloseIcon from '@mui/icons-material/Close';
import uuidv4 from 'utils/uuidv4';
import { useSnackbar } from 'notistack';

function FifthForm({ children, onSubmit }: any) {
  const { step5 } = useSelector((state) => state.supervisorAcceptingForm);
  const { proposal } = useSelector((state) => state.proposal);

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [basedBudget, setBasedBudget] = useState<
    { id?: string; amount: number | undefined; explanation: string; clause: string }[] | []
  >([]);
  const [tempDeletedBudget, setTempDeletedBudget] = useState<
    { id?: string; amount: number | undefined; explanation: string; clause: string }[] | []
  >([]);

  const validationSchema = Yup.object().shape({
    recommended_support: Yup.array().of(
      Yup.object().shape({
        clause: Yup.string().required(
          translate('errors.cre_proposal.detail_project_budgets.clause.required')
        ),
        explanation: Yup.string().required(
          translate('errors.cre_proposal.detail_project_budgets.explanation.required')
        ),
        amount: Yup.number()
          .typeError(translate('errors.cre_proposal.detail_project_budgets.amount.message'))
          .integer()
          .required(translate('errors.cre_proposal.detail_project_budgets.amount.required')),
      })
    ),
  });

  const methods = useForm<SupervisorStep5>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step5, [step5]),
  });

  const {
    handleSubmit,
    control,
    setValue,
    resetField,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const {
    fields: recommendedSupportItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'recommended_support',
  });

  const onSubmitForm = async (data: SupervisorStep5) => {
    if (data.recommended_support.length) {
      data.created_recommended_support = data.recommended_support
        .filter((item) => !basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(el.amount),
        }));

      data.updated_recommended_support = data.recommended_support
        .filter((item) => basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(el.amount),
        }));

      data.deleted_recommended_support = tempDeletedBudget;

      onSubmit(data);
    } else {
      enqueueSnackbar(translate('notification.proposal_item_budget_empty'), {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      resetField('recommended_support');
    }
  };

  useEffect(() => {
    if (proposal && proposal.recommended_supports.length) {
      setBasedBudget(proposal.recommended_supports);
      setValue('recommended_support', proposal.recommended_supports);
    } else {
      resetField('recommended_support');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        {/* <FormGenerator data={FifthFormData} /> */}
        <Grid item xs={12}>
          {recommendedSupportItems.map((v, i) => (
            <Grid container key={v.id} spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <Controller
                  name={`recommended_support.${i}.clause`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      label={translate('funding_project_request_form4.item.label')}
                      placeholder={translate('funding_project_request_form4.item.placeholder')}
                      error={!!error}
                      helperText={error?.message}
                      sx={{
                        '& > .MuiFormHelperText-root': {
                          backgroundColor: 'white',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`recommended_support.${i}.explanation`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      label={translate('funding_project_request_form4.explanation.label')}
                      placeholder={translate(
                        'funding_project_request_form4.explanation.placeholder'
                      )}
                      error={!!error}
                      helperText={error?.message}
                      sx={{
                        '& > .MuiFormHelperText-root': {
                          backgroundColor: 'white',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name={`recommended_support.${i}.amount`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      label={translate('funding_project_request_form4.amount.label')}
                      placeholder={translate('funding_project_request_form4.amount.placeholder')}
                      type="number"
                      error={!!error}
                      helperText={error?.message}
                      sx={{
                        '& > .MuiFormHelperText-root': {
                          backgroundColor: 'white',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  color="error"
                  onClick={() => {
                    const idGetValues = getValues(`recommended_support.${i}.id`);
                    const deleteValues = basedBudget.filter((item) => item.id === idGetValues);

                    const existingData = tempDeletedBudget.find((item) => item.id === idGetValues);

                    if (!existingData) {
                      setTempDeletedBudget([...tempDeletedBudget, ...deleteValues]);
                    }

                    remove(i);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            type="button"
            variant="contained"
            color="inherit"
            fullWidth
            size="medium"
            onClick={async () => {
              append({
                amount: undefined,
                clause: '',
                explanation: '',
                id: uuidv4(),
              });
            }}
          >
            {translate('add_new_line')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default FifthForm;

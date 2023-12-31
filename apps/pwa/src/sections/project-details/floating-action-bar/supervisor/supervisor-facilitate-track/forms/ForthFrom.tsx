import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, TextField, IconButton, Button } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { ForthFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep4 } from '../../../../../../@types/supervisor-accepting-form';
//
import useLocales from 'hooks/useLocales';
import CloseIcon from '@mui/icons-material/Close';
import uuidv4 from 'utils/uuidv4';
import { useSnackbar } from 'notistack';

function ForthFrom({ children, onSubmit }: any) {
  const { step4 } = useSelector((state) => state.supervisorAcceptingForm);
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
    proposal_item_budgets: Yup.array().of(
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

  const methods = useForm<SupervisorStep4>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step4, [step4]),
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
    fields: itemBudgets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'proposal_item_budgets',
  });

  const onSubmitForm = async (data: SupervisorStep4) => {
    if (data.proposal_item_budgets.length) {
      data.created_proposal_budget = data.proposal_item_budgets
        .filter((item) => !basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(el.amount),
        }));

      data.updated_proposal_budget = data.proposal_item_budgets
        .filter((item) => basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(el.amount),
        }));

      data.deleted_proposal_budget = tempDeletedBudget;

      onSubmit(data);
    } else {
      enqueueSnackbar(translate('notification.proposal_item_budget_empty'), {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      resetField('proposal_item_budgets');
    }
  };

  useEffect(() => {
    if (proposal && proposal.proposal_item_budgets.length) {
      setBasedBudget(proposal.proposal_item_budgets);
      setValue('proposal_item_budgets', proposal.proposal_item_budgets);
    } else {
      resetField('proposal_item_budgets');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        {/* <FormGenerator data={ForthFormData} /> */}
        <Grid item xs={12}>
          <Typography sx={{ mb: 2 }}>الموازنة التفصيلية للمشروع</Typography>
          {itemBudgets.map((v, i) => (
            <Grid container key={v.id} spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <Controller
                  name={`proposal_item_budgets.${i}.clause`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      error={!!error}
                      label={translate('funding_project_request_form4.item.label')}
                      placeholder={translate('funding_project_request_form4.item.placeholder')}
                      helperText={error?.message}
                      disabled={true}
                      sx={{
                        '& > .MuiFormHelperText-root': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`proposal_item_budgets.${i}.explanation`}
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
                      disabled={true}
                      helperText={error?.message}
                      sx={{
                        '& > .MuiFormHelperText-root': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name={`proposal_item_budgets.${i}.amount`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      type="number"
                      label={translate('funding_project_request_form4.amount.label')}
                      placeholder={translate('funding_project_request_form4.amount.placeholder')}
                      error={!!error}
                      helperText={error?.message}
                      sx={{
                        '& > .MuiFormHelperText-root': {
                          backgroundColor: 'transparent',
                        },
                      }}
                      disabled={true}
                    />
                  )}
                />
              </Grid>
              {/* <Grid item xs={2}>
                <IconButton
                  color="error"
                  onClick={() => {
                    const idGetValues = getValues(`proposal_item_budgets.${i}.id`);
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
              </Grid> */}
            </Grid>
          ))}
          {/* <Button
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
          </Button> */}
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ForthFrom;

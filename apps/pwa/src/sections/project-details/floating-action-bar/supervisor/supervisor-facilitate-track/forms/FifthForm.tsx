import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, TextField, Button, IconButton } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
import { SupervisorStep4 } from '../../../../../../@types/supervisor-accepting-form';
//
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import uuidv4 from 'utils/uuidv4';
import { getMissingItems } from '../../../../../../utils/checkDeletedArray';
import { CloseIcon } from 'theme/overrides/CustomIcons';
import { arabicToAlphabetical } from '../../../../../../utils/formatNumber';

function FifthForm({ children, onSubmit, paymentNumber, isSubmited, setIsSubmited }: any) {
  const { step4, step1 } = useSelector((state) => state.supervisorAcceptingForm);
  const { proposal } = useSelector((state) => state.proposal);
  const { activeRole } = useAuth();
  const isSupevisor = activeRole === 'tender_project_supervisor' ? true : false;
  const [edit, setEdit] = useState<boolean>(isSupevisor ? false : true);

  const isStepBack =
    proposal.proposal_logs && proposal.proposal_logs.some((item) => item.action === 'step_back')
      ? true
      : false;

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

  const tmpStep4 = useMemo(() => step4, [step4]);

  const methods = useForm<SupervisorStep4>({
    resolver: yupResolver(validationSchema),
    defaultValues: tmpStep4,
    // defaultValues:
    //   // activeRole !== 'tender_project_supervisor'
    //   //   ? tmpStep4
    //   //   : {
    //   //       proposal_item_budgets: [
    //   //         {
    //   //           clause: '',
    //   //           explanation: '',
    //   //           amount: undefined,
    //   //         },
    //   //       ],
    //   //     },
    //   (activeRole === 'tender_project_supervisor' && isSubmited && tmpStep4) ||
    //     ((isStepBack || activeRole !== 'tender_project_supervisor') && tmpStep4) || {
    //       proposal_item_budgets: [
    //         {
    //           clause: '',
    //           explanation: '',
    //           amount: undefined,
    //         },
    //       ],
    //     },
  });

  const {
    handleSubmit,
    control,
    setValue,
    resetField,
    getValues,
    watch,
    formState: { isSubmitting },
  } = methods;

  // const item_budgets = watch('proposal_item_budgets');

  const {
    fields: recommendedSupportItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'proposal_item_budgets',
  });

  const onSubmitForm = (data: SupervisorStep4) => {
    setIsSubmited(true);
    let totalAmount: number | undefined = undefined;
    const fSupportBySpv: number = Number(
      Number(step1?.fsupport_by_supervisor) !== Number(proposal?.amount_required_fsupport)
        ? step1?.fsupport_by_supervisor
        : proposal?.amount_required_fsupport
    );
    // const fSupportBySpv: number = Number(proposal?.amount_required_fsupport);

    if (data.proposal_item_budgets.length) {
      totalAmount = Number(
        data
          ?.proposal_item_budgets!.map((item) => item.amount)
          .reduce((acc, curr) => acc! + curr!, 0)
      );
    }
    // console.log(totalAmount);
    if (data.proposal_item_budgets.length) {
      data.created_proposal_budget = data.proposal_item_budgets
        .filter((item) => !basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(arabicToAlphabetical(el?.amount ? el?.amount.toString() : '0')),
        }));

      // console.log(data.created_proposal_budget, 'testa');

      data.updated_proposal_budget = data.proposal_item_budgets
        .filter((item) => basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(arabicToAlphabetical(el?.amount ? el?.amount.toString() : '0')),
        }));

      // data.deleted_proposal_budget = tempDeletedBudget;
      data.deleted_proposal_budget = getMissingItems(
        proposal.proposal_item_budgets,
        data.proposal_item_budgets
      ).map((el) => ({
        ...el,
        amount: Number(arabicToAlphabetical(el?.amount ? el?.amount.toString() : '0')),
      }));
      // console.log('masuk sini', { step1, fSupportBySpv, totalAmount });
      if (step1 && fSupportBySpv && totalAmount) {
        // console.log('mausk if sini');
        // if (step1.support_type && totalAmount <= proposal.amount_required_fsupport!) {
        //   onSubmit(data);
        // } else {
        //   if (totalAmount < proposal.amount_required_fsupport!) {
        //     onSubmit(data);
        //   } else {
        //   enqueueSnackbar(
        //     `${translate('notification.error_exceeds_amount')}: ${
        //       proposal.amount_required_fsupport
        //     }`,
        //     {
        //       variant: 'error',
        //       preventDuplicate: true,
        //       autoHideDuration: 3000,
        //     }
        //   );
        // }
        // }
        if (step1.support_type) {
          if (totalAmount === fSupportBySpv!) {
            onSubmit(data);
          } else {
            enqueueSnackbar(
              `${translate('notification.error_not_same_amount')}: ${fSupportBySpv}`,
              {
                variant: 'error',
                preventDuplicate: true,
                autoHideDuration: 3000,
              }
            );
          }
        } else {
          if (totalAmount === fSupportBySpv!) {
            onSubmit(data);
            // console.log('mausk else sini :', data);
          } else {
            enqueueSnackbar(`${translate('notification.error_exceeds_amount')}: ${fSupportBySpv}`, {
              variant: 'error',
              preventDuplicate: true,
              autoHideDuration: 3000,
            });
          }
        }
      }
    } else {
      enqueueSnackbar(translate('notification.proposal_item_budget_empty'), {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      resetField('proposal_item_budgets');
    }
  };

  // useEffect(() => {
  //   // handleLoop();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [paymentNumber]);

  const handleLoop = (loopNumber: number) => {
    const initNumber = activeRole === 'tender_project_supervisor' ? 1 : 0;
    for (let i = initNumber; i < loopNumber; i++) {
      append({
        amount: undefined,
        clause: '',
        explanation: '',
        id: uuidv4(),
      });
    }
  };

  const handleRemoveLoop = (loopNumber: number) => {
    for (let i = 0; i < loopNumber; i++) {
      remove(proposal.proposal_item_budgets.length - 1 - i);
    }
  };

  useEffect(() => {
    if (proposal && proposal.proposal_item_budgets.length) {
      setBasedBudget(proposal.proposal_item_budgets);
    }

    // let loopNumber = -1;
    // if (activeRole !== 'tender_project_supervisor') {
    //   if (paymentNumber > proposal.proposal_item_budgets.length) {
    //     loopNumber = Number(paymentNumber) - proposal.proposal_item_budgets.length;
    //     if (loopNumber > 0) {
    //       handleLoop(loopNumber);
    //     }
    //   }
    //   if (paymentNumber < proposal.proposal_item_budgets.length) {
    //     loopNumber = proposal.proposal_item_budgets.length - Number(paymentNumber);
    //     handleRemoveLoop(loopNumber);
    //   }
    // } else {
    //   if (Number(paymentNumber) > 0 && !isStepBack) {
    //     loopNumber = Number(paymentNumber);
    //     handleLoop(loopNumber);
    //   }
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid sx={{ mt: '10px', mb: 2, maxWidth: '83%' }}>
        <TextField
          fullWidth
          placeholder="test"
          size="small"
          label="support amount"
          // value={step1.fsupport_by_supervisor}
          value={
            Number(step1?.fsupport_by_supervisor) !== Number(proposal?.amount_required_fsupport)
              ? step1?.fsupport_by_supervisor
              : proposal?.amount_required_fsupport || 0
            // proposal?.amount_required_fsupport || 0
          }
          InputLabelProps={{ shrink: true }}
          type="number"
          disabled={true}
        />
      </Grid>
      <Grid container rowSpacing={4} columnSpacing={7}>
        {/* <FormGenerator data={FifthFormData} /> */}
        <Grid item xs={12}>
          {recommendedSupportItems.map((v, i) => (
            <Grid container key={v.id} spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <Controller
                  name={`proposal_item_budgets.${i}.clause`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      disabled={edit}
                      data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].clause`}
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
                          backgroundColor: 'transparent',
                        },
                      }}
                      // disabled={!step1.support_type}
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
                      disabled={edit}
                      {...field}
                      data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].explanation`}
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
                          backgroundColor: 'transparent',
                        },
                      }}
                      // disabled={!step1.support_type}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name={`proposal_item_budgets.${i}.amount`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      disabled={edit}
                      {...field}
                      data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].amount`}
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
                          backgroundColor: 'transparent',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                        onWheel: (e: any) => {
                          e.target.blur();

                          e.stopPropagation();

                          setTimeout(() => {
                            e.target.focus();
                          }, 0);
                        },
                      }}
                      // disabled={!step1.support_type}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].delete`}
                  color="error"
                  onClick={() => {
                    const idGetValues = getValues(`proposal_item_budgets.${i}.id`);
                    // data.updated_proposal_budget = data.proposal_item_budgets
                    // .filter((item) => basedBudget.find((i) => i.id === item.id))
                    // .map((el) => ({
                    //   ...el,
                    //   amount: Number(el.amount),
                    // }));
                    // const deleteValues = basedBudget.filter((item) => item.id === idGetValues);
                    const deleteValues = basedBudget
                      .filter((item) => item.id === idGetValues)
                      .map((el) => ({
                        ...el,
                        amount: Number(el.amount),
                      }));
                    // console.log({ deleteValues });
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
            disabled={edit}
          >
            {translate('add_new_line')}
          </Button>
        </Grid>
        {isSupevisor ? null : (
          <Grid
            item
            md={12}
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Button
              variant={edit ? 'outlined' : 'contained'}
              data-cy="acc_form_non_consulation_support_edit_button"
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {edit ? translate('button.re_edit') : translate('button.save_edit')}
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default FifthForm;

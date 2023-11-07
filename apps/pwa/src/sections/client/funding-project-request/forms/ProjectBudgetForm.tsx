import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { AmandementFields } from '../../../../@types/proposal';
import BaseField from '../../../../components/hook-form/BaseField';
import { useSelector } from '../../../../redux/store';
import { arabicToAlphabetical } from '../../../../utils/formatNumber';
type FormValuesProps = {
  amount_required_fsupport: number;
  detail_project_budgets: {
    clause: string;
    explanation: string;
    amount: number;
  }[];
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};

const ProjectBudgetForm = ({ onSubmit, children, defaultValues, revised }: Props) => {
  // console.log({ defaultValues });
  const { translate } = useLocales();
  const { application_admission_settings } = useSelector(
    (state) => state.applicationAndAdmissionSettings
  );
  const [error, setError] = useState({
    open: false,
    message: '',
  });
  const isDisabled =
    !!revised && revised.hasOwnProperty('amount_required_fsupport') ? false : !!revised && true;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const CreatingProposalForm4 = Yup.object().shape({
    amount_required_fsupport: Yup.number()
      .integer()
      .required(translate('errors.cre_proposal.amount_required_fsupport.required')),
    detail_project_budgets: Yup.array().of(
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
  const tmpArrayBudgets =
    defaultValues?.detail_project_budgets?.data || defaultValues?.detail_project_budgets;
  const totalPayments = tmpArrayBudgets.reduce((a: any, b: any) => Number(a) + Number(b.amount), 0);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm4),
    defaultValues: {
      amount_required_fsupport: totalPayments,
      detail_project_budgets:
        defaultValues?.detail_project_budgets?.data || defaultValues?.detail_project_budgets,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const onFormPassValidation = (data: FormValuesProps) => {
    const initialValue = 0;
    const sumWithInitial = data.detail_project_budgets.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    if (sumWithInitial === data.amount_required_fsupport) {
      window.scrollTo(0, 0);
      setError({
        open: false,
        message: '',
      });
      const tmpValue: FormValuesProps = {
        ...data,
        amount_required_fsupport: Number(
          arabicToAlphabetical(data.amount_required_fsupport.toString() || '0')
        ),
        detail_project_budgets: data.detail_project_budgets.map((item: any) => ({
          ...item,
          amount: Number(arabicToAlphabetical(item.amount.toString() || '0')),
        })),
      };
      onSubmit(tmpValue);
    } else {
      setError({
        open: true,
        message: translate('budget_error_message'),
      });
    }
  };

  const handleOnSubmit = (data: FormValuesProps) => {
    if (application_admission_settings.applying_status) {
      if (data?.amount_required_fsupport <= application_admission_settings.hieght_project_budget) {
        onFormPassValidation(data);
      } else {
        setError({
          open: true,
          message: `${translate('modal.disable_proposal.exceed_budgeet_limit')} (${
            application_admission_settings?.hieght_project_budget || 0
          })`,
        });
      }
    } else {
      onFormPassValidation(data);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        {error.open && (
          <Grid item md={12}>
            <Alert severity="error">{error.message}</Alert>
          </Grid>
        )}
        <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={
              !!revised && revised.hasOwnProperty('amount_required_fsupport')
                ? false
                : !!revised && true
            }
            name="amount_required_fsupport"
            label={translate('funding_project_request_form4.amount_required_fsupport.label')}
            placeholder={translate(
              'funding_project_request_form4.amount_required_fsupport.placeholder'
            )}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              onWheel: (e: any) => {
                e.target.blur();

                e.stopPropagation();

                setTimeout(() => {
                  e.target.focus();
                }, 0);
              },
            }}
          />
        </Grid>
        <BaseField
          type="repeater"
          disabled={isDisabled}
          name="detail_project_budgets"
          repeaterFields={[
            {
              disabled: isDisabled,
              type: 'textField',
              name: 'clause',
              label: 'funding_project_request_form4.item.label',
              placeholder: 'funding_project_request_form4.item.placeholder',
              md: 3,
              xs: 12,
            },
            {
              disabled: isDisabled,
              type: 'textField',
              name: 'explanation',
              label: 'funding_project_request_form4.explanation.label',
              placeholder: 'funding_project_request_form4.explanation.placeholder',
              md: 5,
              xs: 12,
            },
            {
              disabled: isDisabled,
              type: 'numberField',
              name: 'amount',
              label: 'funding_project_request_form4.amount.label',
              placeholder: 'funding_project_request_form4.amount.placeholder',
              md: 3,
              xs: 12,
            },
          ]}
          enableAddButton={true}
          enableRemoveButton={true}
        />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectBudgetForm;

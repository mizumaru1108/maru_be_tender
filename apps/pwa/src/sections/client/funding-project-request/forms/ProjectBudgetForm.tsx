import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Alert, Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProjectBudgetData } from '../Forms-Data';
import FormGenerator from 'components/FormGenerator';
import useLocales from 'hooks/useLocales';
import { AmandementFields } from '../../../../@types/proposal';
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
  const { translate } = useLocales();
  const [budgetError, setBudgetError] = useState(false);
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

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm4),
    defaultValues: {
      amount_required_fsupport: defaultValues.amount_required_fsupport,
      detail_project_budgets: defaultValues.detail_project_budgets.data,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const handleOnSubmit = (data: FormValuesProps) => {
    const initialValue = 0;
    const sumWithInitial = data.detail_project_budgets.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    if (sumWithInitial === data.amount_required_fsupport) {
      window.scrollTo(0, 0);
      setBudgetError(false);
      onSubmit(data);
    } else setBudgetError(true);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        {budgetError && (
          <Grid item md={12}>
            <Alert severity="error">{translate('budget_error_message')}</Alert>
          </Grid>
        )}
        <FormGenerator data={ProjectBudgetData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectBudgetForm;

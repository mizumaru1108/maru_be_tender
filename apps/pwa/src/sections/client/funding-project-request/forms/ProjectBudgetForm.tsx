import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Alert, Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProjectBudgetData } from '../Forms-Data';
import FormGenerator from 'components/FormGenerator';
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
};

const ProjectBudgetForm = ({ onSubmit, children, defaultValues }: Props) => {
  const [budgetError, setBudgetError] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    amount_required_fsupport: Yup.number()
      .integer()
      .required('amount_required_fsupport is requiered'),
    detail_project_budgets: Yup.array().of(
      Yup.object().shape({
        clause: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().integer().required(),
      })
    ),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
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
      setBudgetError(false);
      onSubmit(data);
    } else setBudgetError(true);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        {budgetError && (
          <Grid item md={12}>
            <Alert severity="error">
              The sum of the budget's items should be the exact same as the whole budget
            </Alert>
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

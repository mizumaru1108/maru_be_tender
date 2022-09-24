import * as Yup from 'yup';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProjectBudgetData } from '../Forms-Data';
import FormGenerator from 'components/FormGenerator';
type FormValuesProps = {
  amount_required_fsupport: number;
  detail_project_budgets: {
    item: string;
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    amount_required_fsupport: Yup.number().required(),
    detail_project_budgets: Yup.array().of(
      Yup.object().shape({
        item: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().required(),
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
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        <FormGenerator data={ProjectBudgetData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectBudgetForm;

import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { ProjectInfoData } from '../Forms-Data';
import useLocales from 'hooks/useLocales';
type FormValuesProps = {
  num_ofproject_binicficiaries: number;
  project_goals: string;
  project_outputs: string;
  project_strengths: string;
  project_risks: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
};
const ProjectInfoForm = ({ onSubmit, children, defaultValues }: Props) => {
  const { translate } = useLocales();
  const CreatingProposalForm2 = Yup.object().shape({
    num_ofproject_binicficiaries: Yup.number()
      .typeError(translate('errors.cre_proposal.num_ofproject_binicficiaries.message'))
      .required(translate('errors.cre_proposal.num_ofproject_binicficiaries.required')),
    project_goals: Yup.string().required(translate('errors.cre_proposal.project_goals.required')),
    project_outputs: Yup.string().required(
      translate('errors.cre_proposal.project_outputs.required')
    ),
    project_strengths: Yup.string().required(
      translate('errors.cre_proposal.project_strengths.required')
    ),
    project_risks: Yup.string().required(translate('errors.cre_proposal.project_risks.required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm2),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={ProjectInfoData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectInfoForm;

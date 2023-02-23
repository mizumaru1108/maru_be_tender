import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { ProjectInfoData } from '../Forms-Data';
import useLocales from 'hooks/useLocales';
import { AmandementFields } from '../../../../@types/proposal';
import RHFTextArea from '../../../../components/hook-form/RHFTextArea';
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
  revised?: AmandementFields;
};
const ProjectInfoForm = ({ onSubmit, children, defaultValues, revised }: Props) => {
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
  const ProjectInfoData = [
    {
      type: 'numberField',
      name: 'num_ofproject_binicficiaries',
      label: 'funding_project_request_form2.number_of_project_beneficiaries.label',
      placeholder: 'funding_project_request_form2.number_of_project_beneficiaries.placeholder',
      xs: 12,
    },
    {
      type: 'textArea',
      name: 'project_goals',
      label: 'funding_project_request_form2.project_goals.label',
      placeholder: 'funding_project_request_form2.project_goals.placeholder',
      xs: 12,
      md: 12,
    },
    {
      type: 'textArea',
      name: 'project_outputs',
      label: 'funding_project_request_form2.project_outputs.label',
      placeholder: 'funding_project_request_form2.project_outputs.placeholder',
      xs: 12,
    },
    {
      type: 'textArea',
      name: 'project_strengths',
      label: 'funding_project_request_form2.project_strengths.label',
      placeholder: 'funding_project_request_form2.project_strengths.placeholder',
      xs: 12,
    },
    {
      type: 'textArea',
      name: 'project_risks',
      label: 'funding_project_request_form2.project_risk.label',
      placeholder: 'funding_project_request_form2.project_risk.placeholder',
      xs: 12,
    },
  ];
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        {/* <FormGenerator data={ProjectInfoData} /> */}
        <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={
              !!revised && revised.hasOwnProperty('num_ofproject_binicficiaries')
                ? false
                : !!revised && true
            }
            name="num_ofproject_binicficiaries"
            type={'number'}
            label={translate('funding_project_request_form2.number_of_project_beneficiaries.label')}
            placeholder={translate(
              'funding_project_request_form2.number_of_project_beneficiaries.placeholder'
            )}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextArea
            disabled={
              !!revised && revised.hasOwnProperty('project_goals') ? false : !!revised && true
            }
            name="project_goals"
            label={translate('funding_project_request_form2.project_goals.label')}
            placeholder={translate('funding_project_request_form2.project_goals.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextArea
            disabled={
              !!revised && revised.hasOwnProperty('project_outputs') ? false : !!revised && true
            }
            name="project_outputs"
            label={translate('funding_project_request_form2.project_outputs.label')}
            placeholder={translate('funding_project_request_form2.project_outputs.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextArea
            disabled={
              !!revised && revised.hasOwnProperty('project_strengths') ? false : !!revised && true
            }
            name="project_strengths"
            label={translate('funding_project_request_form2.project_strengths.label')}
            placeholder={translate('funding_project_request_form2.project_strengths.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextArea
            disabled={
              !!revised && revised.hasOwnProperty('project_risks') ? false : !!revised && true
            }
            name="project_risks"
            label={translate('funding_project_request_form2.project_risk.label')}
            placeholder={translate('funding_project_request_form2.project_risk.placeholder')}
          />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectInfoForm;

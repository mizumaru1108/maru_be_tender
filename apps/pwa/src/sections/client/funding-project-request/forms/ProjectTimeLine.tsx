import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { AmandementFields } from '../../../../@types/proposal';
import TimeLine from '../../../../components/chart/TimeLine';
import BaseField from '../../../../components/hook-form/BaseField';

type FormValuesProps = {
  project_timeline: {
    name: string;
    start_date: string;
    end_date: string;
  }[];
};
type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};

const ProjectTimeLine = ({ onSubmit, children, defaultValues, revised }: Props) => {
  // console.log({ defaultValues });
  const { translate } = useLocales();
  const [budgetError, setBudgetError] = useState(false);
  const isDisabled = !!revised && revised.hasOwnProperty('project_timeline') ? false : true;
  const tmpDefaultValues =
    (defaultValues?.length &&
      defaultValues.map((item: any) => {
        const { name, start_date, end_date } = item;
        return {
          name: name,
          start_date: moment(start_date).format('YYYY-MM-DD'),
          end_date: moment(end_date).format('YYYY-MM-DD'),
        };
      })) ||
    [];
  // console.log({ tmpDefaultValues });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const ProjectTimeLineSchema = Yup.object().shape({
    project_timeline: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(
          translate('errors.cre_proposal.project_timeline.name.required')
        ),
        start_date: Yup.string().required(
          translate('errors.cre_proposal.project_timeline.start_date.required')
        ),
        end_date: Yup.string().required(
          translate('errors.cre_proposal.project_timeline.end_date.required')
        ),
      })
    ),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ProjectTimeLineSchema),
    defaultValues: {
      project_timeline: (tmpDefaultValues && tmpDefaultValues.length > 0 && tmpDefaultValues) || [
        { name: '', start_date: '', end_date: '' },
      ],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    // reset,
  } = methods;

  const project_timeline = watch('project_timeline');

  // console.log('test', project_timeline);

  const handleOnSubmit = (data: FormValuesProps) => {
    // console.log({ data });
    onSubmit(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        {budgetError && (
          <Grid item md={12}>
            <Alert severity="error">{translate('budget_error_message')}</Alert>
          </Grid>
        )}
        <BaseField
          type="repeater"
          disabled={!!revised && isDisabled ? true : false}
          name="project_timeline"
          repeaterFields={[
            {
              disabled: !!revised && isDisabled ? true : false,
              type: 'textField',
              name: 'name',
              label: 'funding_project_request_project_timeline.activity.label',
              placeholder: 'funding_project_request_project_timeline.activity.placeholder',
              md: 5,
              xs: 12,
            },
            {
              disabled: !!revised && isDisabled ? true : false,
              type: 'datePicker',
              name: 'start_date',
              label: 'funding_project_request_project_timeline.start_date.label',
              placeholder: 'funding_project_request_project_timeline.start_date.placeholder',
              md: 3,
              xs: 12,
              minDate: new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split('T')[0],
            },
            {
              disabled: !!revised && isDisabled ? true : false,
              type: 'datePicker',
              name: 'end_date',
              label: 'funding_project_request_project_timeline.end_date.label',
              placeholder: 'funding_project_request_project_timeline.start_date.placeholder',
              md: 3,
              xs: 12,
              minDate: new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split('T')[0],
            },
          ]}
          enableAddButton={true}
          enableRemoveButton={true}
        />
        {project_timeline.length && (
          <Grid item xs={12}>
            <TimeLine projectTimeLine={project_timeline} />
          </Grid>
        )}
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectTimeLine;

import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { MainFormData } from '../Forms-Data';
import { CustomFile } from 'components/upload';
import useLocales from 'hooks/useLocales';
import { AmandementFields } from '../../../../@types/proposal';

type FormValuesProps = {
  project_name: string;
  project_idea: string;
  project_location: string;
  project_implement_date: string;
  execution_time: number;
  project_beneficiaries: string;
  letter_ofsupport_req: CustomFile | string | null;
  project_attachments: CustomFile | string | null;
  project_beneficiaries_specific_type: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};

const MainInfoForm = ({ onSubmit, children, defaultValues, revised }: Props) => {
  const { translate } = useLocales();
  const CreatingProposalForm1 = Yup.object().shape({
    project_name: Yup.string().required(translate('errors.cre_proposal.project_name.required')),
    project_idea: Yup.string().required(translate('errors.cre_proposal.project_idea.required')),
    project_location: Yup.string().required(
      translate('errors.cre_proposal.project_location.required')
    ),
    project_implement_date: Yup.string().required(
      translate('errors.cre_proposal.project_implement_date.required')
    ),
    execution_time: Yup.number()
      .required(translate('errors.cre_proposal.execution_time.required'))
      .min(1, translate('errors.cre_proposal.execution_time.greater_than_0')),
    project_beneficiaries: Yup.string().required(
      translate('errors.cre_proposal.project_beneficiaries.required')
    ),
    letter_ofsupport_req: Yup.mixed()
      .test('size', translate('errors.cre_proposal.letter_ofsupport_req.fileSize'), (value) => {
        if (value) {
          // const trueSize = value.size * 28;
          if (value.size > 1024 * 1024 * 3) {
            return false;
          }
        }
        return true;
      })
      .test(
        'fileExtension',
        translate('errors.cre_proposal.letter_ofsupport_req.fileExtension'),
        (value) => {
          if (value) {
            if (
              value.type !== 'application/pdf'
              // value.type !== 'image/png' &&
              // value.type !== 'image/jpeg' &&
              // value.type !== 'image/jpg'
            ) {
              return false;
            }
          }
          return true;
        }
      ),
    project_attachments: Yup.mixed()
      .test('size', translate('errors.cre_proposal.project_attachments.fileSize'), (value) => {
        if (value) {
          if (value.size > 1024 * 1024 * 3) {
            return false;
          }
        }
        return true;
      })
      .test(
        'fileExtension',
        translate('errors.cre_proposal.project_attachments.fileExtension'),
        (value) => {
          if (value) {
            if (
              value.type !== 'application/pdf'
              // value.type !== 'image/png' &&
              // value.type !== 'image/jpeg' &&
              // value.type !== 'image/jpg'
            ) {
              return false;
            }
          }
          return true;
        }
      ),
    project_beneficiaries_specific_type: Yup.string().when('project_beneficiaries', {
      is: 'GENERAL',
      then: Yup.string().required(
        translate('errors.cre_proposal.project_beneficiaries_specific_type.required')
      ),
    }),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm1),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    window.scrollTo(0, 0);
    let newValue = { ...defaultValues };
    const newTimeExecution = Number(newValue.execution_time) / 60;
    newValue = { ...newValue, execution_time: newTimeExecution };
    if (newTimeExecution === 0) {
      reset(defaultValues);
    } else {
      reset(newValue);
    }
    // console.log({ newValue });
    // reset(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={MainFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainInfoForm;

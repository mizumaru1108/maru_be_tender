import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { SecondFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep2 } from '../../../../../../@types/supervisor-accepting-form';
import useLocales from 'hooks/useLocales';

function SecondForm({ children, onSubmit }: any) {
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required(
      translate('errors.cre_proposal.organizationName.required')
    ),
    region: Yup.string().required(translate('errors.cre_proposal.region.required')),
    governorate: Yup.string().required(translate('errors.cre_proposal.governorate.required')),
    date_of_esthablistmen: Yup.string().required(
      translate('errors.cre_proposal.date_of_esthablistmen.required')
    ),
    chairman_of_board_of_directors: Yup.string(),
    ceo: Yup.string().required(translate('errors.cre_proposal.ceo.required')),
    been_supported_before: Yup.boolean().required(
      translate('errors.cre_proposal.been_supported_before.required')
    ),
    most_clents_projects: Yup.string().required(
      translate('errors.cre_proposal.most_clents_projects.required')
    ),
    num_of_beneficiaries: Yup.number().required(
      translate('errors.cre_proposal.num_of_beneficiaries.required')
    ),
  });

  const { step2 } = useSelector((state) => state.supervisorAcceptingForm);
  // console.log({ step2 });
  const methods = useForm<SupervisorStep2>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step2, [step2]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SupervisorStep2) => {
    onSubmit(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={SecondFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SecondForm;

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, TextField } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import { ProposalApprovePayload, ProposalFormProps } from 'sections/ceo/forms/types';
import { DetailReport, GeoRange, SearchProject, TheFieldSearch, TheYear } from './form-data';
import { SearchingProposal } from '../types';

type Props = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  data?: SearchingProposal;
};

export default function ProposalAcceptingForm({ children, onSubmit, data }: Props) {
  const validationSchema = Yup.object().shape({
    project: Yup.string().required('Project is required!'),
  });

  const defaultValues: SearchingProposal = {
    project: data?.project || '',
    theYear: data?.theYear || '',
    detailReport: data?.detailReport || '',
    theField: data?.theField || '',
    geoRange: data?.geoRange || '',
  };

  const methods = useForm<SearchingProposal>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SearchingProposal) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={3} columnSpacing={2} sx={{ mt: '10px' }}>
        <FormGenerator data={SearchProject} />
        <Grid
          item
          md={3}
          xs={12}
          // sx={{ mb: 2 }}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Button
            variant="contained"
            color="primary"
            // box shadow = 0
            sx={{
              boxShadow: '0px 0px 0px 0px',
            }}
            type="submit"
            disabled={isSubmitting}
            fullWidth
          >
            Search
          </Button>
        </Grid>
        {/* {methods.getValues('theYear')}
        {methods.getValues('project')}
        {methods.getValues('theField')}
        {methods.getValues('detailReport')} */}

        <Grid container rowSpacing={3} columnSpacing={2} sx={{ mt: '10px' }}>
          <FormGenerator data={TheFieldSearch} />
          <FormGenerator data={TheYear} />
          <FormGenerator data={DetailReport} />
          <FormGenerator data={GeoRange} />
        </Grid>
        {/* <Grid item md={12} xs={12} sx={{ mb: 2 }}>
          {children}
        </Grid> */}
      </Grid>
    </FormProvider>
  );
}

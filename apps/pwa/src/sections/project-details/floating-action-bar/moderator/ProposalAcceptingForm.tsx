import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import { getAlTheTracks } from 'queries/Moderator/getAllTheTracks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'urql';
import * as Yup from 'yup';
import { ApproveProposalFormFields } from './form-data';
import { ProposalFormProps, ProposalModeratorApprovePayload } from './types';

function ProposalAcceptingForm({ children, onSubmit }: ProposalFormProps) {
  const [result, mutate] = useQuery({ query: getAlTheTracks });
  const { data, fetching, error } = result;
  const validationSchema = Yup.object().shape({
    path: Yup.string().required('Path is required!'),
    supervisors: Yup.string().required('Supervisors is required!'),
    notes: Yup.string().required('Notes field is required!'),
  });

  const defaultValues = {
    path: '',
    supervisors: '',
    notes: '',
  };

  const methods = useForm<ProposalModeratorApprovePayload>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const onSubmitForm = async (data: ProposalModeratorApprovePayload) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (data?.project_tracks) {
      console.log(data.project_tracks);
      // setValue('path');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching]);

  if (fetching) return <>... Loading</>;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={3} columnSpacing={7} sx={{ mt: '10px' }}>
        {/* <FormGenerator data={ApproveProposalFormFields} /> */}
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="path"
            label="المسار"
            placeholder="المسار"
            children={
              <>
                <option value="مشروع يخص المساجد" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المساجد
                </option>
                <option value="مشروع يخص المنح الميسر" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المنح الميسر
                </option>
                <option value="مشروع يخص المبادرات" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المبادرات
                </option>
                <option value="test" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص تعميدات
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="supervisors"
            label="المشرفين"
            placeholder="المشرفين"
            children={
              <>
                <option value="supervisor1" style={{ backgroundColor: '#fff' }}>
                  المشرف 1
                </option>
                <option value="supervisor2" style={{ backgroundColor: '#fff' }}>
                  المشرف 2
                </option>
                <option value="supervisor3" style={{ backgroundColor: '#fff' }}>
                  المشرف 3
                </option>
              </>
            }
          />
        </Grid>
        <Grid item md={12}>
          <BaseField
            type="textArea"
            name="notes"
            label="الملاحظات"
            placeholder="الرجاء كتابة الملاحظات"
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: 2 }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalAcceptingForm;

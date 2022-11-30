import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import { getAllSupervisorsForSpecificTrack } from 'queries/Moderator/getAllSupervisorsForSpecificTrack';
import { getAlTheTracks } from 'queries/Moderator/getAllTheTracks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'urql';
import * as Yup from 'yup';
import { ApproveProposalFormFields } from './form-data';
import { ProposalFormProps, ProposalModeratorApprovePayload } from './types';

function ProposalAcceptingForm({ children, onSubmit }: ProposalFormProps) {
  const [supervisors, setSupervisors] = useState([]);
  const validationSchema = Yup.object().shape({
    path: Yup.string().required('Path is required!'),
    supervisors: Yup.string().required('Supervisors is required!'),
    notes: Yup.string(),
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
    watch,
  } = methods;

  const onSubmitForm = async (data: ProposalModeratorApprovePayload) => {
    onSubmit(data);
  };
  const path = watch('path');
  const shouldPause = path === '';
  const [result, mutate] = useQuery({
    query: getAllSupervisorsForSpecificTrack,
    variables: { employee_path: path },
    pause: shouldPause,
  });
  const { data, fetching, error } = result;

  useEffect(() => {
    if (data?.users) {
      setSupervisors(data.users);
      // setValue('path');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={3} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="path"
            label="المسار"
            placeholder="المسار"
            children={
              <>
                <option value="MOSQUES" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المساجد
                </option>
                <option value="CONCESSIONAL_GRANTS" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المنح الميسر
                </option>
                <option value="INITIATIVES" style={{ backgroundColor: '#fff' }}>
                  مشروع يخص المبادرات
                </option>
                <option value="BAPTISMS" style={{ backgroundColor: '#fff' }}>
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
                <option value="all" style={{ backgroundColor: '#fff' }}>
                  كل المشرفين
                </option>
                {data?.users &&
                  data.users.map((item: any, index: any) => (
                    <option key={index} value={item?.id} style={{ backgroundColor: '#fff' }}>
                      {item.name}
                    </option>
                  ))}
              </>
            }
          />
        </Grid>
        <Grid item md={12} xs={12}>
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

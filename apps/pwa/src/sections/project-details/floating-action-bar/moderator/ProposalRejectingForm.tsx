import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { RejectProposalFormFields } from './form-data';

import { ProposalApprovePayload, ProposalFormProps } from './types';

type FormData = {
  notes: string;
  path: string;
};
function ProposalRejectingForm({ children, onSubmit }: ProposalFormProps) {
  const validationSchema = Yup.object().shape({
    notes: Yup.string(),
    path: Yup.string().required('Path is required!'),
  });

  const defaultValues = {
    notes: '',
    path: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: any) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <Grid item md={12} xs={12}>
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
        <Grid item md={12} xs={12}>
          <BaseField
            type="textArea"
            name="notes"
            label="الملاحظات"
            placeholder="الرجاء كتابة الملاحظات"
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ProposalRejectingForm;

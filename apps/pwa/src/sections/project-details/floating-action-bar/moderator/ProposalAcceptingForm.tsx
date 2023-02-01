import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Button, Stack, MenuItem } from '@mui/material';
import { FormProvider, RHFSelect } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import ModalDialog from 'components/modal-dialog';
import useLocales from 'hooks/useLocales';
import { getAllSupervisorsForSpecificTrack } from 'queries/Moderator/getAllSupervisorsForSpecificTrack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'urql';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';

interface FormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  loading?: boolean;
}

interface ProposalModeratorApprovePayload {
  path: string;
  supervisors: string;
  notes: string;
}

function ProposalAcceptingForm({ onSubmit, onClose, loading }: FormProps) {
  const { translate } = useLocales();

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
    watch,
    resetField,
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
    resetField('supervisors');
  }, [resetField]);

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        onClose={onClose}
        isOpen={true}
        showCloseIcon={true}
        title={translate('accept_project')}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        content={
          <Grid container rowSpacing={3} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={6} xs={12}>
              <RHFSelect type="select" name="path" label="المسار" placeholder="المسار" size="small">
                <MenuItem value="MOSQUES">مشروع يخص المساجد</MenuItem>
                <MenuItem value="CONCESSIONAL_GRANTS">مشروع يخص المنح الميسر</MenuItem>
                <MenuItem value="INITIATIVES">مشروع يخص المبادرات</MenuItem>
                <MenuItem value="BAPTISMS">مشروع يخص تعميدات</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item md={6} xs={12}>
              <RHFSelect
                type="select"
                name="supervisors"
                label="المشرفين"
                placeholder="الرجاء تحديد المشرف"
                size="small"
                disabled={fetching}
              >
                <MenuItem value="all">جميع المشرفين</MenuItem>
                {data?.users &&
                  data.users.map((item: any, index: any) => (
                    <MenuItem key={index} value={item?.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </RHFSelect>
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                label="الملاحظات"
                placeholder="الرجاء كتابة الملاحظات"
              />
            </Grid>
          </Grid>
        }
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={onClose}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
            >
              {translate('close')}
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#13B2A2' },
              }}
            >
              {translate('accept')}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default ProposalAcceptingForm;

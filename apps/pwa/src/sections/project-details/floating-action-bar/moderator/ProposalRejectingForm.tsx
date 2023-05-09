import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, MenuItem } from '@mui/material';
import { FormProvider, RHFTextField, RHFSelect } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import ModalDialog from 'components/modal-dialog';
import useLocales from 'hooks/useLocales';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import { formatCapitzlizeText } from 'utils/formatCapitzlizeText';
import * as Yup from 'yup';

type FormData = {
  notes: string;
  path: string;
};

interface tracks {
  id: string;
  name: string;
  with_consultation: boolean;
}

interface FormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  loading?: boolean;
}

function ProposalRejectingForm({ onSubmit, onClose, loading }: FormProps) {
  const { translate } = useLocales();

  const { track_list } = useSelector((state) => state.proposal);

  const validationSchema = Yup.object().shape({
    notes: Yup.string(),
    path: Yup.string().required('Path is required!'),
    reject_reason: Yup.string().required(translate('reject_reason.moderator.required')),
  });

  const defaultValues = {
    notes: '',
    path: '',
    reject_reason: '',
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
      <ModalDialog
        onClose={onClose}
        isOpen={true}
        showCloseIcon={true}
        title={translate('account_manager.reject_project')}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFSelect
                type="select"
                name="path"
                label={translate('path')}
                placeholder={translate('path')}
                size="small"
              >
                {/* <MenuItem value="MOSQUES">{translate('MOSQUES')}</MenuItem>
                <MenuItem value="CONCESSIONAL_GRANTS">{translate('CONCESSIONAL_GRANTS')}</MenuItem>
                <MenuItem value="INITIATIVES">{translate('INITIATIVES')}</MenuItem>
                <MenuItem value="BAPTISMS">{translate('BAPTISMS')}</MenuItem> */}
                {track_list &&
                  track_list?.map((item: tracks, index: any) => (
                    <MenuItem key={index} value={item?.id}>
                      {formatCapitzlizeText(item.name)}
                    </MenuItem>
                  ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <RHFSelect
                name="reject_reason"
                size="small"
                label={translate('reject_reason.moderator.label')}
                placeholder={translate('reject_reason.moderator.select')}
              >
                <MenuItem value="تكرار المشروع">
                  {translate('reject_reason.moderator.reason_list.project_iteration')}
                </MenuItem>
                <MenuItem value="للجهة مشروع آخر تحت الدراسة">
                  {translate('reject_reason.moderator.reason_list.project_under_study')}
                </MenuItem>
                <MenuItem value="للجهة مشروع آخر مدعوم">
                  {translate('reject_reason.moderator.reason_list.project_another_supported')}
                </MenuItem>
                <MenuItem value="عدم وجود تصريح">
                  {translate('reject_reason.moderator.reason_list.project_no_permit')}
                </MenuItem>
                <MenuItem value="التصريح منتهي">
                  {translate('reject_reason.moderator.reason_list.project_permit_expired')}
                </MenuItem>
                <MenuItem value="لا يوجد خطاب طلب دعم">
                  {translate('reject_reason.moderator.reason_list.project_no_support_letter')}
                </MenuItem>
                <MenuItem value="الخطاب موجه لجهة أخرى">
                  {translate('reject_reason.moderator.reason_list.project_letter_to_someone')}
                </MenuItem>
                <MenuItem value="لا يوجد مرفقات">
                  {translate('reject_reason.moderator.reason_list.project_no_attachments')}
                </MenuItem>
                <MenuItem value="نواقص في المرفقات">
                  {translate('reject_reason.moderator.reason_list.project_weakness_attachments')}
                </MenuItem>
                <MenuItem value="الحساب البنكي غير صالح">
                  {translate('reject_reason.moderator.reason_list.project_bank_invalid')}
                </MenuItem>
                <MenuItem value="أخرى">
                  {translate('reject_reason.moderator.reason_list.project_other_reason')}
                </MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                label={translate('notes')}
                placeholder={translate('notes_label')}
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
                backgroundColor: '#FF170F',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#FF4842' },
              }}
            >
              {translate('reject')}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default ProposalRejectingForm;

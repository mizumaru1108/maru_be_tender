import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Grid, Button, MenuItem } from '@mui/material';
import { FormProvider, RHFTextField, RHFSelect } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import useLocales from 'hooks/useLocales';
//
import useAuth from 'hooks/useAuth';
import RHFSelectNoGenerator from 'components/hook-form/RHFSelectNoGen';
import { useState } from 'react';
import { useSelector } from '../../redux/store';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import { getOneProposal } from '../../queries/commons/getOneProposal';
import AcceptedForm from '../../sections/project-details/floating-action-bar/supervisor/supervisor-general-tracks/AcceptedForm';

interface ActionPropos {
  backgroundColor: string;
  hoverColor: string;
  actionLabel: string;
  actionType?: string;
}

interface Propos {
  title: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
  action: ActionPropos;
  loading?: boolean;
}

interface FormInput {
  reject_reason: string;
  notes: string;
  state: string;
}

function NotesModal({ title, onSubmit, onClose, action, loading }: Propos) {
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const [isEdit, setIsEdit] = useState<boolean>(
    action.actionType === 'ACCEPT_CONSULTANT' || action.actionType === 'REJECT' ? false : true
  );

  const validationSchema = Yup.object().shape({
    ...(action.actionType === 'REJECT' &&
      ['tender_project_manager', 'tender_project_supervisor'].includes(activeRole!) && {
        reject_reason: Yup.string().required(),
      }),
    ...(action.actionType === 'STUDY_AGAIN' &&
      ['tender_ceo'].includes(activeRole!) && {
        // notes: Yup.string().required(translate('errors.notes')),
        state: Yup.string().required(translate('errors.role')),
      }),
    ...(action.actionType === 'STEP_BACK' &&
      [
        'tender_project_manager',
        'tender_project_supervisor',
        'tender_consultant',
        'tender_ceo',
      ].includes(activeRole!) && {
        notes: Yup.string().required(translate('errors.notes')),
      }),
    // ...(action.actionType === 'ACCEPT' &&
    //   ['tender_project_manager', 'tender_ceo'].includes(activeRole!) && {
    //     reject_reason: Yup.string().required(),
    //   }),
  });

  const defaultValues = {
    ...(action.actionType === 'REJECT' && { reject_reason: '' }),
    ...(action.actionType === 'STEP_BACK' && { notes: '', state: '' }),
  };

  const methods = useForm<FormInput>({
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
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {title}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            {action.actionType &&
            action.actionType === 'REJECT' &&
            ['tender_project_manager', 'tender_project_supervisor'].includes(activeRole!) ? (
              <Grid item md={12} xs={12}>
                <RHFSelect
                  name="reject_reason"
                  size="small"
                  label="سبب الرفض *"
                  placeholder="الرجاء اختيار سبب المشروع المرفوض"
                >
                  <MenuItem value="تكرار المشروع">تكرار المشروع</MenuItem>
                  <MenuItem value="ارتفاع التكاليف">ارتفاع التكاليف</MenuItem>
                  <MenuItem value="ضعف الجهة">ضعف الجهة</MenuItem>
                  <MenuItem value="عدم اختصاص الجهة">عدم اختصاص الجهة</MenuItem>
                  <MenuItem value="عدم تفاعل الجهة">عدم تفاعل الجهة</MenuItem>
                  <MenuItem value="عدم وجود بند">عدم وجود بند</MenuItem>
                  <MenuItem value="انتهاء الموازنة المخصصة للبند">
                    انتهاء الموازنة المخصصة للبند
                  </MenuItem>
                  <MenuItem value="عدم وجود عروض أسعار كافية">عدم وجود عروض أسعار كافية</MenuItem>
                  <MenuItem value="الجهة غير حاصلة على شهادة الحوكمة">
                    الجهة غير حاصلة على شهادة الحوكمة
                  </MenuItem>
                  <MenuItem value="المشروع غير متوافق مع احتياج المستفيدين">
                    المشروع غير متوافق مع احتياج المستفيدين
                  </MenuItem>
                  <MenuItem value="لا يوجد دراسة احتياج للمشروع">
                    لا يوجد دراسة احتياج للمشروع
                  </MenuItem>
                  <MenuItem value="المشروع ينقصه موافقة رسمية">المشروع ينقصه موافقة رسمية</MenuItem>
                  <MenuItem value="أخرى">أخرى</MenuItem>
                </RHFSelect>
              </Grid>
            ) : null}
            {action.actionType &&
            action.actionType === 'STUDY_AGAIN' &&
            activeRole! === 'tender_ceo' ? (
              <Grid item md={12} xs={12}>
                <RHFSelectNoGenerator
                  name="state"
                  size="small"
                  label="إرجاع المعاملة للدراسة*"
                  placeholder="الدور المختار"
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="MODERATOR" style={{ backgroundColor: '#fff' }}>
                    {translate('permissions.MODERATOR')}
                  </option>
                  <option value="PROJECT_SUPERVISOR" style={{ backgroundColor: '#fff' }}>
                    {translate('permissions.PROJECT_SUPERVISOR')}
                  </option>
                  <option value="PROJECT_MANAGER" style={{ backgroundColor: '#fff' }}>
                    {translate('permissions.PROJECT_MANAGER')}
                  </option>
                </RHFSelectNoGenerator>
              </Grid>
            ) : null}
            {['tender_project_manager', 'tender_ceo'].includes(activeRole!) &&
              proposal.project_track !== 'CONCESSIONAL_GRANTS' &&
              action.actionType === 'ACCEPT' && (
                <Grid item md={12} xs={12}>
                  <AcceptedForm onEdit={(value) => setIsEdit(value)} />
                </Grid>
              )}
            <Grid item md={12} xs={12}>
              <RHFTextField
                multiline
                minRows={3}
                name="notes"
                label="الملاحظات"
                placeholder="اكتب ملاحظاتك هنا"
                required={action.actionType === 'STEP_BACK' ? true : false}
              />
            </Grid>
          </Grid>
        }
        isOpen={true}
        onClose={onClose}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        showCloseIcon={true}
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
              إغلاق
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              disabled={isEdit}
              sx={{
                backgroundColor: action.backgroundColor,
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: action.hoverColor },
              }}
            >
              {action.actionLabel}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default NotesModal;

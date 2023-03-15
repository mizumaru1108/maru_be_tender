// react
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
// @mui + component
import { Grid, Typography, MenuItem, Box, Stack, Button, useTheme } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField, RHFRadioGroup } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import { LoadingButton } from '@mui/lab';
import Iconify from 'components/Iconify';
// hooks
import useLocales from 'hooks/useLocales';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { IPropFromProjectReport, CloseReportForm } from '../types';

// ------------------------------------------------------------------------------------------

export default function SubmitProjectReportForm({
  onSubmit,
  defaultValues,
  isEdit,
  loading,
}: IPropFromProjectReport) {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const { id, actionType } = useParams();
  const navigate = useNavigate();

  const [tmpCloseReportValues, setTmpCloseReportValues] = useState<CloseReportForm>(defaultValues);

  const SubmitFormSchema = Yup.object().shape({
    number_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Number of beneficiaries must be at least 1'))
      .required('Number of beneficiaries is required'),
    target_beneficiaries: Yup.string().required('Target beneficiaries is required'),
    execution_place: Yup.string().required('Execution time is required'),
    gender: Yup.string().required('Gender is required'),
    project_duration: Yup.string().required('Project Duration is required'),
    project_repeated: Yup.string().required('Project Repeated is required'),
    number_of_volunteer: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Number of volunteer must be at least 1'))
      .required('Number of volunteer is required'),
    number_of_staff: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Number of staff must be at least 1'))
      .required('Number of staff is required'),
    attachments: Yup.array().min(1, translate('Attachments is required')),
    images: Yup.array().min(1, translate('Images is required')),
  });

  const methods = useForm<CloseReportForm>({
    resolver: yupResolver(SubmitFormSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const { handleSubmit } = methods;

  const onSubmitForm = async (data: CloseReportForm) => {
    setTmpCloseReportValues(data);

    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={4} sx={{ pb: 10 }}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 1 }}>
            {translate('pages.common.close_report.text.main_information')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="number_of_beneficiaries"
            type="number"
            size="small"
            label={translate('pages.common.close_report.text.form.number_of_beneficiaries.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.number_of_beneficiaries.placeholder'
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFSelect
            name="target_beneficiaries"
            size="small"
            label={translate('pages.common.close_report.text.form.target_beneficiaries.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.target_beneficiaries.placeholder'
            )}
          >
            <MenuItem value="children">
              {translate('pages.common.close_report.text.option.children')}
            </MenuItem>
            <MenuItem value="general_students">
              {translate('pages.common.close_report.text.option.general_students')}
            </MenuItem>
            <MenuItem value="university_students">
              {translate('pages.common.close_report.text.option.university_students')}
            </MenuItem>
            <MenuItem value="residents">
              {translate('pages.common.close_report.text.option.residents')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFSelect
            name="execution_place"
            size="small"
            label={translate('pages.common.close_report.text.form.execution_place.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.execution_place.placeholder'
            )}
          >
            <MenuItem value="village">
              {translate('pages.common.close_report.text.option.village')}
            </MenuItem>
            <MenuItem value="district">
              {translate('pages.common.close_report.text.option.district')}
            </MenuItem>
            <MenuItem value="regency">
              {translate('pages.common.close_report.text.option.regency')}
            </MenuItem>
            <MenuItem value="province">
              {translate('pages.common.close_report.text.option.province')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFRadioGroup
            name="gender"
            label={translate('pages.common.close_report.text.form.gender.label')}
            placeholder={translate('pages.common.close_report.text.form.gender.placeholder')}
            options={[
              { label: translate('section_portal_reports.heading.gender.woman'), value: 'woman' },
              { label: translate('section_portal_reports.heading.gender.men'), value: 'men' },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 1 }}>
            {translate('pages.common.close_report.text.about_project')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFSelect
            name="project_duration"
            size="small"
            label={translate('pages.common.close_report.text.form.project_duration.label')}
          >
            <MenuItem value="years">
              {translate('pages.common.close_report.text.option.years')}
            </MenuItem>
            <MenuItem value="months">
              {translate('pages.common.close_report.text.option.months')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFSelect
            name="project_repeated"
            size="small"
            label={translate('pages.common.close_report.text.form.project_repeated.label')}
          >
            <MenuItem value="annual">
              {translate('pages.common.close_report.text.option.annual')}
            </MenuItem>
            <MenuItem value="monthly">
              {translate('pages.common.close_report.text.option.monthly')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={isEdit}
            name="number_of_volunteer"
            type="number"
            size="small"
            label={translate('pages.common.close_report.text.form.number_of_volunteer.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.number_of_volunteer.placeholder'
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={isEdit}
            name="number_of_staff"
            type="number"
            size="small"
            label={translate('pages.common.close_report.text.form.number_of_staff.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.number_of_staff.placeholder'
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="p" sx={{ mb: 1.5 }}>
            {translate('pages.common.close_report.text.form.attachments.label')}
          </Typography>
          <BaseField type="uploadMulti" name="attachments" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="p" sx={{ mb: 1.5 }}>
            {translate('pages.common.close_report.text.form.images.label')}
          </Typography>
          <BaseField type="uploadMulti" name="images" />
        </Grid>
      </Grid>

      <Box
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: 1,
          position: 'sticky',
          margin: 'auto',
          width: '100%',
          bottom: 24,
          border: `1px solid ${theme.palette.grey[400]}`,
          zIndex: 10,
        }}
      >
        <Stack
          component="div"
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <LoadingButton variant="contained" color="primary" type="submit" loading={loading}>
            {translate('pages.common.close_report.btn.send_submit_form')}
            <Iconify icon={'eva:checkmark-outline'} width={20} height={20} sx={{ ml: 1 }} />
          </LoadingButton>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            {translate('going_back_one_step')}
            <Iconify
              icon={
                currentLang.value === 'en'
                  ? 'eva:corner-up-right-outline'
                  : 'eva:corner-up-left-outline'
              }
              width={20}
              height={20}
              sx={{ ml: 1 }}
            />
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
}

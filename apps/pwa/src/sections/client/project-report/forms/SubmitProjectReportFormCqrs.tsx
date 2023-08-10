// react
import React, { useMemo, useState } from 'react';
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
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';

// ------------------------------------------------------------------------------------------

type ITargetBeneficiaries = {
  id: string;
  is_deleted: boolean;
  name: string;
};

export default function SubmitProjectReportFormCqrs({
  onSubmit,
  defaultValues,
  isEdit,
  loading,
}: IPropFromProjectReport) {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  // const { id, actionType } = useParams();
  const navigate = useNavigate();

  // const [beneficiaries, setBeneficiaries] = React.useState<ITargetBeneficiaries[] | []>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const { activeRole } = useAuth();
  // const { enqueueSnackbar } = useSnackbar();

  // const [tmpCloseReportValues, setTmpCloseReportValues] = useState<CloseReportForm>(defaultValues);

  const SubmitFormSchema = Yup.object().shape({
    number_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.clo_report.number_value.min')),
    // .required('Number of beneficiaries is required'),
    genders: Yup.array().of(
      Yup.object().shape({
        selected_values: Yup.string().required(translate('errors.clo_report.selected.required')),
        selected_numbers: Yup.number()
          .positive()
          .integer()
          .min(1, translate('errors.clo_report.number_value.min')),
      })
    ),
    execution_places: Yup.array().of(
      Yup.object().shape({
        selected_values: Yup.string().required(translate('errors.clo_report.selected.required')),
        selected_numbers: Yup.number()
          .positive()
          .integer()
          .min(1, translate('errors.clo_report.number_value.min')),
      })
    ),
    project_duration: Yup.string().required(translate('errors.clo_report.selected.required')),
    number_project_duration: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.clo_report.number_value.min')),
    project_repeated: Yup.string().required(translate('errors.clo_report.selected.required')),
    number_project_repeated: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.clo_report.number_value.min')),
    number_of_volunteer: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.clo_report.number_value.min')),
    number_of_staff: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.clo_report.number_value.min')),
    beneficiaries: Yup.array().of(
      Yup.object().shape({
        selected_values: Yup.string().required(translate('errors.clo_report.selected.required')),
        selected_numbers: Yup.number()
          .positive()
          .integer()
          .min(1, translate('errors.clo_report.number_value.min')),
      })
    ),
    attachments: Yup.array().min(1, translate('errors.clo_report.attachments.required')),
    images: Yup.array().min(1, translate('errors.clo_report.images.required')),
    // target_beneficiaries: Yup.string().required('Target beneficiaries is required'),
    // execution_place: Yup.string().required('Execution time is required'),
    // gender: Yup.string().required('Gender is required'),
    // project_repeated: Yup.string().required('Project Repeated is required'),
    // number_of_volunteer: Yup.number()
    //   .positive()
    //   .integer()
    //   .min(1, translate('Number of volunteer must be at least 1'))
    // number_of_staff: Yup.number()
    //   .positive()
    //   .integer()
    //   .min(1, translate('Number of staff must be at least 1'))
    // attachments: Yup.array().min(1, translate('Attachments is required')),
    // images: Yup.array().min(1, translate('Images is required')),
  });

  const methods = useForm<CloseReportForm>({
    resolver: yupResolver(SubmitFormSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const { handleSubmit } = methods;

  const onSubmitForm = async (data: CloseReportForm) => {
    // console.log({ data });
    // setTmpCloseReportValues(data);

    onSubmit(data);
  };

  // const getBeneficiaries = async () => {
  //   setIsLoading(true);
  //   try {
  //     const rest = await axiosInstance.get(`/tender/proposal/beneficiaries/find-all?limit=0`, {
  //       headers: { 'x-hasura-role': activeRole! },
  //     });
  //     if (rest) {
  //       const test = rest.data.data
  //         .filter((bank: any) => bank.is_deleted === false || bank.is_deleted === null)
  //         .map((bank: any) => bank);
  //       setBeneficiaries(test);
  //     }
  //   } catch (error) {
  //     // console.error(error.message);
  //     setBeneficiaries([]);
  //     const statusCode = (error && error.statusCode) || 0;
  //     const message = (error && error.message) || null;
  //     if (message && statusCode !== 0) {
  //       enqueueSnackbar(error.message, {
  //         variant: 'error',
  //         preventDuplicate: true,
  //         autoHideDuration: 3000,
  //         anchorOrigin: {
  //           vertical: 'bottom',
  //           horizontal: 'center',
  //         },
  //       });
  //     } else {
  //       enqueueSnackbar(translate('pages.common.internal_server_error'), {
  //         variant: 'error',
  //         preventDuplicate: true,
  //         autoHideDuration: 3000,
  //         anchorOrigin: {
  //           vertical: 'bottom',
  //           horizontal: 'center',
  //         },
  //       });
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   getBeneficiaries();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // if (isLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={4} sx={{ pb: 5 }}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 1 }}>
            {translate('pages.common.close_report.text.main_information')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            disabled={isEdit || loading}
            name="number_of_beneficiaries"
            type="number"
            size="medium"
            label={translate('pages.common.close_report.text.form.number_of_beneficiaries.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.number_of_beneficiaries.placeholder'
            )}
            data-cy="pages.common.close_report.text.form.number_of_beneficiaries.placeholder"
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {translate('pages.common.close_report.text.form.genders.label')}
          </Typography>
        </Grid> */}
        <BaseField
          type="repeater"
          disabled={isEdit || loading}
          name="genders"
          repeaterFields={[
            {
              disabled: isEdit || loading,
              type: 'selectWithoutGenerator',
              name: 'selected_values',
              label: translate('pages.common.close_report.text.form.genders.selected_value.label'),
              placeholder: translate(
                'pages.common.close_report.text.form.genders.selected_value.placeholder'
              ),
              md: 6,
              xs: 12,
              children: (
                <>
                  <option value="MEN" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(translate('project_beneficiaries.MEN'))}
                  </option>
                  <option value="WOMEN" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(translate('project_beneficiaries.WOMEN'))}
                  </option>
                </>
              ),
            },
            {
              disabled: isEdit || loading,
              type: 'numberField',
              name: 'selected_numbers',
              label: translate('pages.common.close_report.text.form.genders.number.label'),
              placeholder: translate(
                'pages.common.close_report.text.form.genders.number.placeholder'
              ),
              md: 5,
              xs: 12,
            },
          ]}
          enableAddButton={true}
          enableRemoveButton={true}
        />
        {/* <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {translate('pages.common.close_report.text.form.execution_places.label')}
          </Typography>
        </Grid> */}
        <BaseField
          type="repeater"
          disabled={isEdit || loading}
          name="execution_places"
          repeaterFields={[
            {
              disabled: isEdit || loading,
              type: 'selectWithoutGenerator',
              name: 'selected_values',
              label: translate(
                'pages.common.close_report.text.form.execution_places.selected_value.label'
              ),
              placeholder: translate(
                'pages.common.close_report.text.form.execution_places.selected_value.placeholder'
              ),
              md: 6,
              xs: 12,
              children: (
                <>
                  <option value="village" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.execution_places.village')
                    )}
                  </option>
                  <option value="center" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.execution_places.center')
                    )}
                  </option>
                  <option value="province" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.execution_places.province')
                    )}
                  </option>
                  <option value="area" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.execution_places.area')
                    )}
                  </option>
                </>
              ),
            },
            {
              disabled: isEdit || loading,
              type: 'numberField',
              name: 'selected_numbers',
              label: translate('pages.common.close_report.text.form.execution_places.number.label'),
              placeholder: translate(
                'pages.common.close_report.text.form.execution_places.number.placeholder'
              ),
              md: 5,
              xs: 12,
            },
          ]}
          enableAddButton={true}
          enableRemoveButton={true}
        />
        {/* <Grid item xs={12} md={6}>
          <RHFSelect
            name="target_beneficiaries"
            size="medium"
            label={translate('pages.common.close_report.text.form.target_beneficiaries.label')}
            placeholder={translate(
              'pages.common.close_report.text.form.target_beneficiaries.placeholder'
            )}
          >
            {beneficiaries.length > 0 &&
              beneficiaries.map((item, index) => (
                <MenuItem
                  data-cy={`pages.common.close_report.text.target_beneficiaries.option${index}`}
                  key={index}
                  value={item.name}
                >
                  {item.name}
                </MenuItem>
              ))}
          </RHFSelect>
        </Grid> */}
        {/* <Grid item xs={12} md={12}>
          <RHFSelect
            name="execution_place"
            size="medium"
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
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <RHFRadioGroup
            name="gender"
            label={translate('pages.common.close_report.text.form.gender.label')}
            placeholder={translate('pages.common.close_report.text.form.gender.placeholder')}
            options={[
              { label: translate('section_portal_reports.heading.gender.woman'), value: 'woman' },
              { label: translate('section_portal_reports.heading.gender.men'), value: 'men' },
            ]}
          />
        </Grid> */}

        {/* <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 700, mt: 1 }}>
            {translate('pages.common.close_report.text.about_project')}
          </Typography>
        </Grid> */}
        <Grid item xs={12} md={6}>
          <RHFSelect
            disabled={isEdit || loading}
            name="project_duration"
            size="medium"
            label={translate('pages.common.close_report.text.form.project_duration.label')}
            data-cy="pages.common.close_report.text.form.project_duration.label"
          >
            <MenuItem value="days" data-cy="pages.common.close_report.text.option.days">
              {translate('pages.common.close_report.text.option.days')}
            </MenuItem>
            <MenuItem value="weeks" data-cy="pages.common.close_report.text.option.weeks">
              {translate('pages.common.close_report.text.option.weeks')}
            </MenuItem>
            <MenuItem value="months" data-cy="pages.common.close_report.text.option.months">
              {translate('pages.common.close_report.text.option.months')}
            </MenuItem>
            <MenuItem value="years" data-cy="pages.common.close_report.text.option.years">
              {translate('pages.common.close_report.text.option.years')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={isEdit || loading}
            name="number_project_duration"
            type="number"
            size="medium"
            label={translate('pages.common.close_report.text.form.number_project_duration.label')}
            data-cy="pages.common.close_report.text.form.number_project_duration"
            placeholder={translate(
              'pages.common.close_report.text.form.number_project_duration.placeholder'
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFSelect
            disabled={isEdit || loading}
            name="project_repeated"
            size="medium"
            label={translate('pages.common.close_report.text.form.project_repeated.label')}
            data-cy="pages.common.close_report.text.form.project_repeated.label"
          >
            {/* <MenuItem value="annual">
              {translate('pages.common.close_report.text.option.annual')}
            </MenuItem> */}
            <MenuItem value="days" data-cy="pages.common.close_report.text.option.daily">
              {translate('pages.common.close_report.text.option.daily')}
            </MenuItem>
            <MenuItem value="months" data-cy="pages.common.close_report.text.option.monthly">
              {translate('pages.common.close_report.text.option.monthly')}
            </MenuItem>
            <MenuItem value="years" data-cy="pages.common.close_report.text.option.yearly">
              {translate('pages.common.close_report.text.option.yearly')}
            </MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={isEdit || loading}
            name="number_project_repeated"
            type="number"
            size="medium"
            label={translate('pages.common.close_report.text.form.number_project_repeated.label')}
            data-cy="pages.common.close_report.text.form.number_project_repeated"
            placeholder={translate(
              'pages.common.close_report.text.form.number_project_repeated.placeholder'
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={isEdit || loading}
            name="number_of_volunteer"
            type="number"
            size="medium"
            label={translate('pages.common.close_report.text.form.number_of_volunteer.label')}
            data-cy="pages.common.close_report.text.form.number_of_volunteer"
            placeholder={translate(
              'pages.common.close_report.text.form.number_of_volunteer.placeholder'
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={isEdit || loading}
            name="number_of_staff"
            type="number"
            size="medium"
            label={translate('pages.common.close_report.text.form.number_of_staff.label')}
            data-cy="pages.common.close_report.text.form.number_of_staff"
            placeholder={translate(
              'pages.common.close_report.text.form.number_of_staff.placeholder'
            )}
          />
        </Grid>
        <BaseField
          type="repeater"
          disabled={isEdit || loading}
          name="beneficiaries"
          repeaterFields={[
            {
              disabled: isEdit || loading,
              type: 'selectWithoutGenerator',
              name: 'selected_values',
              label: translate(
                'pages.common.close_report.text.form.beneficiaries.selected_value.label'
              ),
              placeholder: translate(
                'pages.common.close_report.text.form.beneficiaries.selected_value.placeholder'
              ),
              md: 6,
              xs: 12,
              children: (
                <>
                  <option value="children" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.beneficiaries.children')
                    )}
                  </option>
                  <option value="general_education_students" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate(
                        'pages.common.close_report.text.option.beneficiaries.general_education_students'
                      )
                    )}
                  </option>
                  <option
                    value="female_students_of_general_education"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {formatCapitalizeText(
                      translate(
                        'pages.common.close_report.text.option.beneficiaries.female_students_of_general_education'
                      )
                    )}
                  </option>
                  <option value="college_students" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate(
                        'pages.common.close_report.text.option.beneficiaries.college_students'
                      )
                    )}
                  </option>
                  <option value="female_college_students" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate(
                        'pages.common.close_report.text.option.beneficiaries.female_college_students'
                      )
                    )}
                  </option>
                  <option value="mothers" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.beneficiaries.mothers')
                    )}
                  </option>
                  <option value="parents" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.beneficiaries.parents')
                    )}
                  </option>
                  <option value="notables" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.beneficiaries.notables')
                    )}
                  </option>
                  <option value="residents" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate('pages.common.close_report.text.option.beneficiaries.residents')
                    )}
                  </option>
                  <option value="the_general_community" style={{ backgroundColor: '#fff' }}>
                    {formatCapitalizeText(
                      translate(
                        'pages.common.close_report.text.option.beneficiaries.the_general_community'
                      )
                    )}
                  </option>
                </>
              ),
            },
            {
              disabled: isEdit || loading,
              type: 'numberField',
              name: 'selected_numbers',
              label: translate('pages.common.close_report.text.form.beneficiaries.number.label'),
              placeholder: translate(
                'pages.common.close_report.text.form.beneficiaries.number.placeholder'
              ),
              md: 5,
              xs: 12,
            },
          ]}
          enableAddButton={true}
          enableRemoveButton={true}
        />
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="p" sx={{ mb: 1.5 }}>
            {translate('pages.common.close_report.text.form.attachments.label')}
          </Typography>
          <BaseField disabled={isEdit || loading} type="uploadMulti" name="attachments" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="p" sx={{ mb: 1.5 }}>
            {translate('pages.common.close_report.text.form.images.label')}
          </Typography>
          <BaseField disabled={isEdit || loading} type="uploadMulti" name="images" />
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
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            loading={loading}
            data-cy="pages.common.close_report.btn.send_submit_form"
          >
            {translate('pages.common.close_report.btn.send_submit_form')}
            <Iconify icon={'eva:checkmark-outline'} width={20} height={20} sx={{ ml: 1 }} />
          </LoadingButton>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            disabled={loading}
            data-cy="pages.common.close_report.btn.go_back_one_step"
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

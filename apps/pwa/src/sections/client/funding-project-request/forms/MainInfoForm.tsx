import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FormProvider, RHFDatePicker, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { MainFormData } from '../Forms-Data';
import { CustomFile } from 'components/upload';
import useLocales from 'hooks/useLocales';
import { AmandementFields } from '../../../../@types/proposal';
import RHFSelectNoGenerator from '../../../../components/hook-form/RHFSelectNoGen';
import { REGION } from '../../../../_mock/region';
import BaseField from '../../../../components/hook-form/BaseField';
import { RHFUploadSingleFileBe } from '../../../../components/hook-form/RHFUploadBe';
import { borderColor } from '@mui/system';

type FormValuesProps = {
  project_name: string;
  project_idea: string;
  project_location: string;
  project_implement_date: string;
  execution_time: number;
  project_beneficiaries: string;
  letter_ofsupport_req: CustomFile | string | null;
  project_attachments: CustomFile | string | null;
  // project_beneficiaries_specific_type: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};

const MainInfoForm = ({ onSubmit, children, defaultValues, revised }: Props) => {
  const { translate } = useLocales();
  const CreatingProposalForm1 = Yup.object().shape({
    project_name: Yup.string().required(translate('errors.cre_proposal.project_name.required')),
    project_idea: Yup.string().required(translate('errors.cre_proposal.project_idea.required')),
    project_location: Yup.string().required(
      translate('errors.cre_proposal.project_location.required')
    ),
    project_implement_date: Yup.string().required(
      translate('errors.cre_proposal.project_implement_date.required')
    ),
    execution_time: Yup.number()
      .required(translate('errors.cre_proposal.execution_time.required'))
      .min(1, translate('errors.cre_proposal.execution_time.greater_than_0')),
    project_beneficiaries: Yup.string().required(
      translate('errors.cre_proposal.project_beneficiaries.required')
    ),
    letter_ofsupport_req: Yup.mixed()
      .test('size', translate('errors.cre_proposal.letter_ofsupport_req.fileSize'), (value) => {
        if (value) {
          const maxSize = 1024 * 1024 * 10;
          console.log('size:', value.size);
          console.log('maxSize: ', maxSize);
          // const trueSize = value.size * 28;
          if (value.size > 1024 * 1024 * 10) {
            return false;
          }
        }
        return true;
      })
      .test(
        'fileExtension',
        translate('errors.cre_proposal.letter_ofsupport_req.fileExtension'),
        (value) => {
          if (value) {
            // console.log('fileExtension:', value);
            if (
              value.fileExtension &&
              value.fileExtension !== 'application/pdf'
              // value.type !== 'image/png' &&
              // value.type !== 'image/jpeg' &&
              // value.type !== 'image/jpg'
            ) {
              return false;
            } else if (value.type && value.type !== 'application/pdf') {
              return false;
            }
          }
          return true;
        }
      ),
    project_attachments: Yup.mixed()
      .test('size', translate('errors.cre_proposal.project_attachments.fileSize'), (value) => {
        if (value) {
          if (value.size > 1024 * 1024 * 10) {
            return false;
          }
        }
        return true;
      })
      .test(
        'fileExtension',
        translate('errors.cre_proposal.project_attachments.fileExtension'),
        (value) => {
          if (value) {
            // console.log({ value });
            if (
              value.fileExtension &&
              value.fileExtension !== 'application/pdf'
              // value.type !== 'image/png' &&
              // value.type !== 'image/jpeg' &&
              // value.type !== 'image/jpg'
            ) {
              return false;
            } else if (value.type && value.type !== 'application/pdf') {
              return false;
            }
          }
          return true;
        }
      ),
    // project_beneficiaries_specific_type: Yup.string().when('project_beneficiaries', {
    //   is: 'GENERAL',
    //   then: Yup.string().required(
    //     translate('errors.cre_proposal.project_beneficiaries_specific_type.required')
    //   ),
    // }),
    project_beneficiaries_specific_type: Yup.string().when('project_beneficiaries', {
      is: 'GENERAL',
      then: Yup.string().required(
        translate('errors.cre_proposal.project_beneficiaries_specific_type.required')
      ),
    }),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreatingProposalForm1),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    window.scrollTo(0, 0);
    let newValue = { ...defaultValues };
    const newTimeExecution = Number(newValue.execution_time) / 60;
    newValue = { ...newValue, execution_time: newTimeExecution };
    if (newTimeExecution === 0) {
      reset(defaultValues);
    } else {
      reset(newValue);
    }
    // console.log({ newValue });
    // reset(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        {/* <FormGenerator data={MainFormData} /> */}
        <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={
              !!revised && revised.hasOwnProperty('project_name') ? false : !!revised && true
            }
            name="project_name"
            label={translate('funding_project_request_form1.project_name.label')}
            placeholder={translate('funding_project_request_form1.project_name.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={
              !!revised && revised.hasOwnProperty('project_idea') ? false : !!revised && true
            }
            name="project_idea"
            label={translate('funding_project_request_form1.project_idea.label')}
            placeholder={translate('funding_project_request_form1.project_idea.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelectNoGenerator
            disabled={
              !!revised && revised.hasOwnProperty('project_location') ? false : !!revised && true
            }
            name="project_location"
            label={translate('funding_project_request_form1.project_applying_place.label')}
            placeholder={translate(
              'funding_project_request_form1.project_applying_place.placeholder'
            )}
          >
            <>
              {Object.keys(REGION).map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </RHFSelectNoGenerator>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            disabled={
              !!revised && revised.hasOwnProperty('project_implement_date')
                ? false
                : !!revised && true
            }
            name="project_implement_date"
            label={translate('funding_project_request_form1.project_applying_date.label')}
            placeholder={translate(
              'funding_project_request_form1.project_applying_date.placeholder'
            )}
            InputProps={{
              inputProps: {
                min: new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString()
                  .split('T')[0],
              },
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={
              !!revised && revised.hasOwnProperty('execution_time') ? false : !!revised && true
            }
            name="execution_time"
            type={'number'}
            label={translate('funding_project_request_form1.applying_duration.label')}
            placeholder={translate('funding_project_request_form1.applying_duration.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelectNoGenerator
            disabled={
              !!revised && revised.hasOwnProperty('project_beneficiaries')
                ? false
                : !!revised && true
            }
            name="project_beneficiaries"
            label={translate('funding_project_request_form1.target_group_type.label')}
            placeholder={translate('funding_project_request_form1.target_group_type.placeholder')}
          >
            <>
              <option value="GENERAL" style={{ backgroundColor: '#fff' }}>
                أخرى
              </option>
              <option value="MIDDLE_AGED" style={{ backgroundColor: '#fff' }}>
                شباب
              </option>
              <option value="KIDS" style={{ backgroundColor: '#fff' }}>
                أشبال
              </option>
              <option value="MEN" style={{ backgroundColor: '#fff' }}>
                رجال
              </option>
              <option value="WOMEN" style={{ backgroundColor: '#fff' }}>
                فتيات
              </option>
              <option value="ELDERLY" style={{ backgroundColor: '#fff' }}>
                كبار السن
              </option>
            </>
          </RHFSelectNoGenerator>
        </Grid>
        {/* <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={!!revised && revised.hasOwnProperty('project_beneficiaries_specific_type')}
            name="project_beneficiaries_specific_type"
            label={translate('نوع الفئة المستهدفة الخارجية')}
            placeholder={translate('الرجاء كتابة نوع الفئة المستهدفة')}
          />
        </Grid> */}
        <Grid item md={12} xs={12}>
          <BaseField
            type="uploadLabel"
            label={translate('funding_project_request_form1.letter_support_request.label')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFUploadSingleFileBe
            disabled={
              !!revised && revised.hasOwnProperty('letter_ofsupport_req')
                ? false
                : !!revised && true
            }
            name="letter_ofsupport_req"
            placeholder={translate(
              'funding_project_request_form1.letter_support_request.placeholder'
            )}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <BaseField
            type="uploadLabel"
            label={translate('funding_project_request_form1.project_attachments.label')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFUploadSingleFileBe
            disabled={
              !!revised && revised.hasOwnProperty('project_attachments') ? false : !!revised && true
            }
            name="project_attachments"
            placeholder={translate('funding_project_request_form1.project_attachments.placeholder')}
          />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainInfoForm;

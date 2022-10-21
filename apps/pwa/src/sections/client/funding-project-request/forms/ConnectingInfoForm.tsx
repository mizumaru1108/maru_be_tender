import * as Yup from 'yup';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BaseField from 'components/hook-form/BaseField';
import { REGION } from '_mock/region';
import { RegionNames } from '../../../../@types/region';
type FormValuesProps = {
  pm_name: string;
  pm_mobile: string;
  pm_email: string;
  region: string;
  governorate: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
};

const ConnectingInfoForm = ({ onSubmit, children, defaultValues }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    pm_name: Yup.string().required('Project manager name is required'),
    pm_mobile: Yup.string()
      .matches(
        /^\+9665[0-9]{8}$/,
        `The CEO Mobile must be written in the exact way of +9665xxxxxxxx`
      )
      .required('Mobile number is required'),
    pm_email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    region: Yup.string().required('Region is required'),
    governorate: Yup.string().required('City is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const region = watch('region') as RegionNames | '';
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <BaseField
            type="textField"
            name="pm_name"
            label="funding_project_request_form3.project_manager_name.label"
            placeholder="funding_project_request_form3.project_manager_name.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="pm_mobile"
            label="funding_project_request_form3.mobile_number.label"
            placeholder="funding_project_request_form3.mobile_number.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="textField"
            name="pm_email"
            label="funding_project_request_form3.email.label"
            placeholder="funding_project_request_form3.email.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="region"
            label="funding_project_request_form3.region.label"
            placeholder="funding_project_request_form3.region.placeholder"
          >
            <>
              {Object.keys(REGION).map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </BaseField>
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            type="select"
            name="governorate"
            label="funding_project_request_form3.city.label"
            placeholder="funding_project_request_form3.city.placeholder"
          >
            {region !== '' && (
              <>
                {REGION[`${region}`].map((item: any, index: any) => (
                  <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </option>
                ))}
              </>
            )}
          </BaseField>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;

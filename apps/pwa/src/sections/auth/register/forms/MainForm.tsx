import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, MenuItem } from '@mui/material';
import { AUTHORITY } from '_mock/authority';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { MainValuesProps } from '../../../../@types/register';
import axiosInstance from '../../../../utils/axios';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { TMRA_RAISE_URL } from '../../../../config';
import { AuthorityInterface, ClientFieldInterface } from '../../../admin/authority/list/types';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: any;
};

const MainForm: React.FC<FormProps> = ({ children, onSubmit, defaultValues }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [authorities, setAuthorities] = React.useState<AuthorityInterface[] | []>([]);
  const [clientFields, setClientFields] = React.useState<ClientFieldInterface[] | []>([]);
  const [isFetchingAuthoritites, setIsFetchingAuthorities] = React.useState<boolean>(false);
  const [isFetchingClientFields, setIsFetchingClientFields] = React.useState<boolean>(false);

  const RegisterSchemaFirstForm = Yup.object().shape({
    entity: Yup.string().required(translate('errors.register.entity.required')),
    client_field: Yup.string().required(translate('errors.register.client_field.required')),
    authority: Yup.string().required(translate('errors.register.authority.required')),
    date_of_esthablistmen: Yup.date()
      .typeError(translate('errors.register.date_of_esthablistmen.required'))
      .default(null)
      .required(translate('errors.register.date_of_esthablistmen.required')),
    headquarters: Yup.string().required(translate('errors.register.headquarters.required')),
    num_of_employed_facility: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.register.num_of_employed_facility.min'))
      .required(translate('errors.register.num_of_employed_facility.required')),
    num_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .min(1, translate('errors.register.num_of_beneficiaries.min'))
      .required(translate('errors.register.num_of_beneficiaries.required')),
    // vat: Yup.boolean().required(),
  });

  const methods = useForm<MainValuesProps>({
    resolver: yupResolver(RegisterSchemaFirstForm),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const fetchAuthorities = React.useCallback(
    async (client_field: string) => {
      setIsFetchingAuthorities(true);
      try {
        const url = `${TMRA_RAISE_URL}/authority-management/authorities?client_field_id=${client_field}&limit=0`;
        // console.log({ url });
        const response = await axios.get(url);
        if (response) {
          const mappedRes = response.data.data
            .filter(
              (authority: any) => authority.is_deleted === false || authority.is_deleted === null
            )
            .map((authority: any) => authority);
          setAuthorities(mappedRes);
        }
      } catch (error) {
        // console.error(error.message);
        setAuthorities([]);
        const statusCode = (error && error.statusCode) || 0;
        const message = (error && error.message) || null;
        if (message && statusCode !== 0) {
          enqueueSnackbar(error.message, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        } else {
          enqueueSnackbar(translate('pages.common.internal_server_error'), {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        }
      } finally {
        setIsFetchingAuthorities(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueSnackbar]
  );

  const fetchClientFields = async () => {
    setIsFetchingClientFields(true);
    try {
      const response = await axios.get(
        `${TMRA_RAISE_URL}/authority-management/client-fields?limit=0`
      );
      if (response) {
        const mappedRes = response.data.data
          .filter(
            (client_field: any) =>
              client_field.is_deleted === false || client_field.is_deleted === null
          )
          .map((client_field: any) => client_field);
        setClientFields(mappedRes);
      }
    } catch (error) {
      // console.error(error.message);
      setAuthorities([]);
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsFetchingClientFields(false);
    }
  };

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = methods;

  const onSubmitForm = async (data: MainValuesProps) => {
    reset({ ...data });
    onSubmit(data);
  };

  const client_field: string = watch('client_field');

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    fetchClientFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, fetchClientFields]);

  React.useEffect(() => {
    if (client_field !== '') {
      fetchAuthorities(client_field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_field, fetchAuthorities]);

  // console.log({ authorities });
  // console.log({ clientFields });
  // console.log({ client_field });

  if (isFetchingClientFields) {
    return <>{translate('pages.common.loading')}</>;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="entity"
            label={translate('register_form1.entity.label')}
            placeholder={translate('register_form1.entity.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFSelect
            name="client_field"
            label={translate('register_form1.entity_area.label')}
            placeholder={translate('register_form1.entity_area.placeholder')}
          >
            {/* <MenuItem value="main">
              {translate('register_form1.entity_area.options.sub_entity_area')}
            </MenuItem>
            <MenuItem value="sub">
              {translate('register_form1.entity_area.options.main_entity_area')}
            </MenuItem> */}
            {clientFields.map((option, i) => (
              <MenuItem key={i} value={option.client_field_id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFSelect
            name="authority"
            label={translate('register_form1.authority.label')}
            placeholder={translate('register_form1.authority.placeholder')}
          >
            {authorities.map((option, i) => (
              <MenuItem key={i} value={option.authority_id}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        {/* {client_field !== '' && client_field === 'main' && (
          <Grid item md={12} xs={12}>
            <RHFSelect
              name="authority"
              label={translate('register_form1.authority.label')}
              placeholder={translate('register_form1.authority.placeholder')}
            >
              {AUTHORITY.map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
        )}
        {client_field !== '' && client_field === 'sub' && (
          <Grid item md={12} xs={12}>
            <RHFTextField name="authority" label={translate('register_form1.authority.label')} />
          </Grid>
        )} */}
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            name="date_of_esthablistmen"
            label={translate('register_form1.date_of_establishment.label')}
            placeholder={translate('register_form1.date_of_establishment.placeholder')}
            InputProps={{
              inputProps: {
                max: new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0],
              },
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            name="headquarters"
            label={translate('register_form1.headquarters.label')}
            placeholder={translate('register_form1.headquarters.placeholder')}
          >
            {[
              'register_form1.headquarters.options.own',
              'register_form1.headquarters.options.rent',
            ].map((option, i) => (
              <MenuItem key={i} value={translate(option)}>
                {translate(option)}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="num_of_employed_facility"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            label={translate('register_form1.number_of_employees.label')}
            placeholder={translate('register_form1.number_of_employees.placeholder')}
            onKeyDown={(e) => {
              const prevent = ['e', 'E', '+', '-', '.', ','];
              prevent.includes(e.key) && e.preventDefault();
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(event) => {
              const newValue =
                event.target.value === '' || !event.target.value ? 0 : event.target.value;
              setValue('num_of_employed_facility', newValue as number);
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="num_of_beneficiaries"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            label={translate('register_form1.number_of_beneficiaries.label')}
            placeholder={translate('register_form1.number_of_beneficiaries.placeholder')}
            onKeyDown={(e) => {
              const prevent = ['e', 'E', '+', '-', '.', ','];
              prevent.includes(e.key) && e.preventDefault();
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(event) => {
              const newValue =
                event.target.value === '' || !event.target.value ? 0 : event.target.value;
              setValue('num_of_beneficiaries', newValue as number);
            }}
          />
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <BaseField
            type="checkbox"
            name="vat"
            label={translate('register_form1.vat.placeholder')}
          />
        </Grid> */}
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainForm;

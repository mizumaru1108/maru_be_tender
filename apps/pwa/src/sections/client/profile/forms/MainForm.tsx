import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import RHFDatePicker from 'components/hook-form/RHFDatePicker';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { REGIONS } from 'sections/auth/register/RegisterFormData';
import * as Yup from 'yup';
import { MainValuesProps } from '../../../../@types/register';
import RHFSelectNoGenerator from '../../../../components/hook-form/RHFSelectNoGen';
import { FEATURE_MENU_ADMIN_ADD_AUTHORITY, TMRA_RAISE_URL } from '../../../../config';
import { ClientFieldInterface, AuthorityInterface } from '../../../admin/authority/list/types';
import ReplayIcon from '@mui/icons-material/Replay';
import { removeEmptyKey } from '../../../../utils/remove-empty-key';

const AuthoityArray = [
  {
    value: 'main',
    label: 'register_form1.entity_area.options.main_entity_area',
  },
  {
    value: 'sub',
    label: 'register_form1.entity_area.options.sub_entity_area',
  },
];

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  // defaultValues: MainValuesProps;
  defaultValues: any;
  isEdit?: boolean;
};
type ClientFieldName = 'main' | 'sub';

const MainForm: React.FC<FormProps> = ({ children, onSubmit, defaultValues, isEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [authorities, setAuthorities] = React.useState<AuthorityInterface[] | []>([]);
  const [clientFields, setClientFields] = React.useState<ClientFieldInterface[] | []>([]);
  const [isFetchingClientFields, setIsFetchingClientFields] = React.useState<boolean>(false);
  const [isFetchingAuthoritites, setIsFetchingAuthorities] = React.useState<boolean>(false);
  const [clientFieldId, setClientFieldId] = React.useState<string>('');
  const [clientFieldName, setClientFieldName] = React.useState<ClientFieldName>('main');

  const RegisterSchema = Yup.object().shape({
    entity: Yup.string().required('Entity is required'),
    client_field: Yup.string().required('Client Field Area is required'),
    authority: Yup.string().required('Authority is required'),
    date_of_esthablistmen: Yup.string().default(null).required('Date Of Establishment is required'),
    headquarters: Yup.string().required('Headquarters is required'),
    num_of_employed_facility: Yup.number()
      .positive()
      .integer()
      .required('Number Of Employees is required'),
    num_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .required('Number Of Beneficiaries is required'),
  });

  const methods = useForm<MainValuesProps>({
    resolver: yupResolver(RegisterSchema),
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

  const fetchClientFields = React.useCallback(async () => {
    setIsFetchingClientFields(true);
    try {
      const response = await axios.get(
        `${TMRA_RAISE_URL}/authority-management/client-fields?limit=0`
      );
      if (response) {
        const mappedRes = response.data.data
          .sort((a: ClientFieldInterface, b: ClientFieldInterface) => a.name.localeCompare(b.name))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar]);

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  const handleChangeClientField = (client_field_id: string) => {
    const tmpClientId =
      clientFields.find(
        (client_field: ClientFieldInterface) =>
          String(client_field.name) === String(client_field_id)
      ) || undefined;

    const checkClientId =
      clientFields.find(
        (client_field: ClientFieldInterface) =>
          String(client_field.client_field_id) === String(client_field_id)
      ) || undefined;

    if (tmpClientId) {
      // console.log('sub', { tmpClientId, checkClientId, client_field_id });
      fetchAuthorities(tmpClientId.client_field_id);
      setClientFieldId(tmpClientId.client_field_id);
      setClientFieldName(tmpClientId.name as ClientFieldName);
    } else {
      if (checkClientId) {
        setClientFieldName(checkClientId.name as ClientFieldName);
        if (checkClientId.name !== 'sub') {
          fetchAuthorities(checkClientId.client_field_id);
          setClientFieldId(checkClientId.client_field_id);
        } else {
          setValue('authority', '');
        }
      } else {
        setClientFieldId('');
        setValue('authority', '');
      }
    }
  };

  const onSubmitForm = async (data: MainValuesProps) => {
    const tmpClientField =
      clientFields.find(
        (client_field: ClientFieldInterface) => client_field.client_field_id === data.client_field
      )?.name || undefined;
    const tmpAuthority =
      authorities.find((authority: AuthorityInterface) => authority.authority_id === data.authority)
        ?.name || undefined;
    const tmpValue: MainValuesProps = {
      ...data,
      authority: tmpAuthority || data.authority,
      authority_id: clientFieldName === 'main' && tmpAuthority ? data.authority : undefined,
      client_field: tmpClientField || data.client_field,
      client_field_id: tmpClientField ? data.client_field : undefined,
    };
    // reset({ ...data });
    onSubmit(removeEmptyKey(tmpValue));
    // console.log('test ting', removeEmptyKey(tmpValue));
  };

  const handleScrollPagination = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    // console.log('test:', e.target);
    const selectElement = e.target as HTMLDivElement;
    const isAtBottom =
      selectElement.scrollTop + selectElement.clientHeight === selectElement.scrollHeight;

    // Check if the scroll position is at the top
    const isAtTop = selectElement.scrollTop === 0;
    if (isAtBottom) {
      // Do something when scrolling to the bottom
      console.log('Scrolled to the bottom');
    }

    if (isAtTop) {
      // Do something when scrolling to the top
      console.log('Scrolled to the top');
    }
  };
  // console.log({ defaultValues });
  React.useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    if (defaultValues.client_field === 'main' && clientFields.length > 0) {
      if (defaultValues.authority_id) {
        setValue('authority', defaultValues.authority_id);
      } else {
        setValue('authority', defaultValues.authority);
      }
      const tmpClientId = clientFields.find(
        (client_field: ClientFieldInterface) =>
          String(client_field.name) === String(defaultValues.client_field)
      )?.client_field_id;
      if (tmpClientId) {
        fetchAuthorities(tmpClientId);
        setClientFieldId(tmpClientId);
        setValue('client_field', tmpClientId);
      } else {
        alert('tmpClientId not found');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, clientFields]);
  // console.log('test defaultValues: ', defaultValues);
  React.useEffect(() => {
    if (FEATURE_MENU_ADMIN_ADD_AUTHORITY) {
      fetchClientFields();
    }
  }, [fetchClientFields]);
  // console.log({ defaultValues, clientFields, authorities });
  const client_field = watch('client_field');
  if (isFetchingClientFields) {
    return <>{translate('pages.common.loading')}</>;
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="entity"
            disabled={isEdit}
            label={'اسم الشريك'}
            placeholder={'الرجاء أدخل اسم الشريك'}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          {/* <RHFSelectNoGenerator disabled={isEdit} name="client_field" label={'مجال الجهة'}>
            <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
              {translate('register_form1.entity_area.placeholder')}
            </option>
            <option value="main" style={{ backgroundColor: '#fff' }}>
              {translate('register_form1.entity_area.options.sub_entity_area')}
            </option>
            <option value="sub" style={{ backgroundColor: '#fff' }}>
              {translate('register_form1.entity_area.options.main_entity_area')}
            </option>
          </RHFSelectNoGenerator> */}
          <RHFSelect
            disabled={isFetchingClientFields || isFetchingAuthoritites || isEdit}
            name="client_field"
            label={translate('register_form1.entity_area.label')}
            placeholder={translate('register_form1.entity_area.placeholder')}
            onChange={(e) => {
              if (e.target.value !== '') {
                if (FEATURE_MENU_ADMIN_ADD_AUTHORITY) {
                  handleChangeClientField(e.target.value);
                }
              }
              setValue('client_field', e.target.value);
            }}
          >
            {FEATURE_MENU_ADMIN_ADD_AUTHORITY
              ? clientFields.map((option, i) => (
                  <MenuItem key={i} value={option.client_field_id}>
                    {option.name}
                  </MenuItem>
                ))
              : AuthoityArray.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {translate(`${option.label}`)}
                  </MenuItem>
                ))}
          </RHFSelect>
        </Grid>
        {/* {client_field !== '' && (
          <>
            {client_field === 'main' && (
              <Grid item md={12} xs={12}>
                <RHFSelectNoGenerator
                  disabled={isEdit}
                  name="authority"
                  label={translate('register_form1.authority.label')}
                >
                  <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                    {translate('register_form1.authority.placeholder')}
                  </option>
                  <option value="0" style={{ backgroundColor: '#fff' }}>
                    أخرى
                  </option>
                  <option value="1" style={{ backgroundColor: '#fff' }}>
                    المؤسسة العامة للتدريب التقني والمهني
                  </option>
                  <option value="2" style={{ backgroundColor: '#fff' }}>
                    هيئة الأوقاف
                  </option>
                  <option value="3" style={{ backgroundColor: '#fff' }}>
                    وزارة التجارة والاستثمار
                  </option>
                  <option value="4" style={{ backgroundColor: '#fff' }}>
                    وزارة التعليم
                  </option>
                  <option value="5" style={{ backgroundColor: '#fff' }}>
                    وزارة الشؤون الإسلامية
                  </option>
                  <option value="6" style={{ backgroundColor: '#fff' }}>
                    وزارة العدل
                  </option>
                  <option value="7" style={{ backgroundColor: '#fff' }}>
                    وزارة الموارد البشرية والتنميةالاجتماعية
                  </option>
                </RHFSelectNoGenerator>
              </Grid>
            )}
            {client_field === 'sub' && (
              <Grid item md={12} xs={12}>
                <RHFTextField
                  disabled={isEdit}
                  name="authority"
                  label={translate('register_form1.authority.label')}
                />
              </Grid>
            )}
          </>
        )} */}
        {client_field !== '' && clientFieldName === 'main' && clientFieldId && (
          <Grid item md={12} xs={12}>
            <RHFSelect
              disabled={isFetchingClientFields || isFetchingAuthoritites || isEdit}
              name="authority"
              label={translate('register_form1.authority.label')}
              placeholder={translate('register_form1.authority.placeholder')}
              sx={{ overflow: 'auto' }}
              onChange={(e) => {
                setValue('authority', e.target.value);
              }}
              SelectProps={{
                MenuProps: {
                  // PaperProps: { style: { maxHeight: 300 }, onScroll: handleScrollPagination },
                  PaperProps: { style: { maxHeight: 300 } },
                },
              }}
            >
              {authorities.length > 0 &&
                !isFetchingAuthoritites &&
                authorities.map((option, i) => (
                  <MenuItem key={i} value={option.authority_id}>
                    {option.name}
                  </MenuItem>
                ))}
              {/* <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              </Box> */}
            </RHFSelect>
            {authorities.length === 0 && (
              <Button
                disabled={isFetchingAuthoritites}
                data-cy={`button-retry-fetching-bank`}
                variant="outlined"
                onClick={() => {
                  if (clientFieldId) {
                    fetchAuthorities(clientFieldId);
                  } else {
                    alert('clientFieldId is empty or null');
                  }
                }}
                endIcon={<ReplayIcon />}
              >
                Re-try Fetching Authorities
              </Button>
            )}
          </Grid>
        )}
        {client_field !== '' && clientFieldName === 'sub' && (
          <Grid item md={12} xs={12}>
            <RHFTextField
              disabled={isFetchingClientFields || isFetchingAuthoritites || isEdit}
              name="authority"
              label={translate('register_form1.authority.label')}
            />
          </Grid>
        )}
        <Grid item md={6} xs={12}>
          <RHFDatePicker
            disabled={isEdit}
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
          <RHFSelectNoGenerator
            disabled={isEdit}
            name="headquarters"
            label={translate('register_form1.headquarters.label')}
          >
            <>
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('register_form1.headquarters.placeholder')}
              </option>
              {REGIONS.map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </RHFSelectNoGenerator>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="num_of_employed_facility"
            label={translate('register_form1.number_of_employees.label')}
            placeholder={translate('register_form1.number_of_employees.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="num_of_beneficiaries"
            label={translate('register_form1.number_of_beneficiaries.label')}
            placeholder={translate('register_form1.number_of_beneficiaries.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainForm;

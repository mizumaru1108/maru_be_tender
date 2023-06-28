import { useEffect, useState } from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { MenuItem, TextField, TextFieldProps, Typography, useTheme } from '@mui/material';
//
// import { LIST_OF_BANK } from 'sections/auth/register/RegisterFormData';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { setBankList } from '../../redux/slices/banks';
import { AuthorityInterface } from '../../sections/admin/bank-name/list/types';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  children?: React.ReactNode;
};

type Props = IProps & TextFieldProps;

export default function RHFSelect({ name, children, placeholder, ...other }: Props) {
  const { control } = useFormContext();
  const theme = useTheme();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState<boolean>(false);
  const [bankValue, setBankValue] = useState<AuthorityInterface[] | []>([]);
  const dispatch = useDispatch();

  const getBankList = async () => {
    setLoading(true);
    try {
      // const { status, data } = await axios.get(
      //   `${TMRA_RAISE_URL}/tender/proposal/payment/find-bank-list`
      // );

      let datas: AuthorityInterface[] = [];
      // console.log({ activeRole });
      // if (activeRole && activeRole !== 'tender_client') {
      //   // console.log('masuk if');
      //   // const rest = await axiosInstance.get(`/tender/proposal/payment/find-bank-list?limit=0`, {
      //   //   headers: { 'x-hasura-role': activeRole! },
      //   // });
      //   datas = rest.data.data;
      // } else {
      //   // console.log('masuk else');
      //   const rest = await axios.get(
      //     `${TMRA_RAISE_URL}/tender/proposal/payment/find-bank-list?limit=0`
      //   );
      //   datas = rest.data.data;
      // }
      const rest = await axios.get(
        `${TMRA_RAISE_URL}/tender/proposal/payment/find-bank-list?limit=0`
      );
      datas = rest.data.data;
      // console.log({ datas });
      if (datas) {
        const test = datas
          .filter((bank: any) => bank.is_deleted === false || bank.is_deleted === null)
          .map((bank: any) => bank);
        // console.log({ test });
        // console.log(datas);
        setBankValue(test);
        dispatch(setBankList(test));
        setLoading(false);
      }
    } catch (error) {
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
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (name === 'bank_name') {
      getBankList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {![
            'bank_name',
            'client_field',
            'authority',
            'headquarters',
            'region',
            'governorate',
            'clause',
            'clasification_field',
            'support_goal_id',
            'reject_reason',
            'accreditation_type_id',
            'path',
            'employee_path',
            'supervisors',
            'target_beneficiaries',
            'execution_place',
            'project_duration',
            'project_repeated',
          ].includes(name) ? (
            <TextField
              {...field}
              InputLabelProps={{ shrink: true }}
              select
              fullWidth
              SelectProps={{ native: true }}
              error={!!error}
              helperText={
                <Typography component="span" sx={{ backgroundColor: 'transparent' }}>
                  {error?.message}
                </Typography>
              }
              {...other}
              sx={{
                '& > .MuiFormHelperText-root': {
                  backgroundColor: 'transparent',
                },
                ...(!other.disabled && {
                  '& label.Mui-focused': {
                    color: theme.palette.grey[800],
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.grey[800],
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'inherit',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }),
              }}
            >
              {placeholder && (
                <option value="" disabled selected>
                  {placeholder}
                </option>
              )}
              {children}
            </TextField>
          ) : (
            <TextField
              {...field}
              select
              fullWidth
              error={!!error}
              helperText={
                <Typography variant="caption" component="span" sx={{ backgroundColor: 'white' }}>
                  {error?.message}
                </Typography>
              }
              {...other}
              sx={{
                '& > .MuiFormHelperText-root': {
                  backgroundColor: 'transparent',
                },
                ...(!other.disabled && {
                  '& label.Mui-focused': {
                    color: theme.palette.grey[800],
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.grey[800],
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'inherit',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }),
              }}
            >
              {
                !children && name === 'bank_name' && !loading && bankValue && bankValue.length > 0
                  ? bankValue.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.bank_name}
                      </MenuItem>
                    ))
                  : null
                // LIST_OF_BANK.map((option) => (
                //   <MenuItem key={option} value={option}>
                //     {option}
                //   </MenuItem>
                // ))}
              }
              {children && children}
            </TextField>
          )}
        </>
      )}
    />
  );
}

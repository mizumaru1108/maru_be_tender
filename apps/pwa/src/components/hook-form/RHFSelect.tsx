import { useEffect, useState } from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
//
// import { LIST_OF_BANK } from 'sections/auth/register/RegisterFormData';
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { useDispatch } from 'react-redux';
import { AuthorityInterface } from '../../sections/admin/bank-name/list/types';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { dispatch, useSelector } from '../../redux/store';
import { getBankList } from '../../redux/slices/banks';

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

  // const [loading, setLoading] = useState<boolean>(false);
  const [bankValue, setBankValue] = useState<AuthorityInterface[] | []>([]);
  // const dispatch = useDispatch();
  const { banks, isLoading, error } = useSelector((state) => state.banks);
  // console.log({ error });

  const handleRefetchBankList = () => {
    dispatch(getBankList());
  };

  // useEffect(() => {
  //   if (name === 'bank_name') {
  //     getBankList();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [name]);
  // console.log('error', error);

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
            'track',
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
              disabled={(name === 'bank_name' && isLoading) || false}
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
                !children && name === 'bank_name' && !isLoading && banks && banks.length > 0
                  ? [...banks]
                      .filter((bank) => bank.is_deleted === false)
                      .map((option, index) => (
                        <MenuItem
                          data-cy={`bank-name-select-option-${index}`}
                          key={option.id}
                          value={option.id}
                        >
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
          {name === 'bank_name' && banks.length === 0 && !isLoading ? (
            <Button
              data-cy={`button-retry-fetching-bank`}
              variant="outlined"
              onClick={handleRefetchBankList}
              endIcon={<ReplayIcon />}
            >
              Re-try Fetching Bank List
            </Button>
          ) : null}
        </>
      )}
    />
  );
}

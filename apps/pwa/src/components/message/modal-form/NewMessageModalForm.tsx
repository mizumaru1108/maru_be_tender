// React
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// hooks
import useLocales from 'hooks/useLocales';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import axiosInstance from 'utils/axios';
import uuidv4 from 'utils/uuidv4';
// component
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { FormProvider } from 'components/hook-form';
import Label from 'components/Label';
import Iconify from 'components/Iconify';
import Image from 'components/Image';
// types
import { NewMessageModalFormProps, NewMessageModalFormValues, UserDataTracks } from './types';
import { Conversation } from '../../../@types/wschat';

export default function NewMessageModalForm({
  user,
  activeRole,
  corespondence,
  onSubmit,
}: NewMessageModalFormProps) {
  const { translate } = useLocales();
  const theme = useTheme();

  const [listTrack, setListTrack] = useState<{ id?: string }[] | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  // User Data
  const [listUser, setListUser] = useState<UserDataTracks[] | []>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // FORM
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalDataUser, setTotalDataUser] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    trackType: Yup.string().required('Procedures is required!'),
    employeeId: Yup.string().required('Support Output is required!'),
  });

  const defaultValues = {
    trackType: '',
    employeeId: '',
  };

  const methods = useForm<NewMessageModalFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: NewMessageModalFormValues) => {
    onSubmit(data);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTrack(event.target.value);

    if (event.target.value !== '') {
      findUserTracks(event.target.value);
    }
  };

  const getAllProposalTracks = async () => {
    const { data } = await axiosInstance.get('/tender-proposal/fetch-track', {
      headers: { 'x-hasura-role': activeRole! },
    });

    if (data.statusCode === 200) {
      setListTrack(data.data);
    }
  };

  const findUserTracks = async (employee_path: string) => {
    const only_external = corespondence === 'external' ? 1 : 0;
    const only_internal = corespondence === 'internal' ? 1 : 0;

    setLoadingUser(true);
    const { data } = await axiosInstance.get('/tender-user/find-users', {
      params: {
        employee_path: employee_path,
        only_external,
        only_internal,
        limit: 6,
      },
      headers: { 'x-hasura-role': activeRole! },
    });

    if (data.statusCode === 200) {
      setListUser(data.data);
      setPage(data.currentPage);
      setTotalDataUser(data.total);
      setHasNextPage(data.hasNextPage);

      const pagesNumber = Math.ceil(data.total / data.limit);
      setPageNumber(pagesNumber);

      setLoadingUser(false);
    }
  };

  const paginateUserList = async (elem: number) => {
    const only_external = corespondence === 'external' ? 1 : 0;
    const only_internal = corespondence === 'internal' ? 1 : 0;

    let params: {
      only_external: number;
      only_internal: number;
      page: number;
      limit: number;
      employee_path?: string;
    } = {
      only_external,
      only_internal,
      page: elem,
      limit: 6,
    };

    if (selectedTrack !== '') params.employee_path = selectedTrack;

    setLoadingUser(true);
    const { data } = await axiosInstance.get('/tender-user/find-users', {
      params,
      headers: { 'x-hasura-role': activeRole! },
    });

    if (data.statusCode === 200) {
      setListUser(data.data);
      setPage(data.currentPage);
      setTotalDataUser(data.total);
      setHasNextPage(data.hasNextPage);

      const pagesNumber = Math.ceil(data.total / data.limit);
      setPageNumber(pagesNumber);

      setLoadingUser(false);
    }
  };

  const findUserExternal = async () => {
    setLoadingUser(true);
    const { data } = await axiosInstance.get('/tender-user/find-users', {
      params: {
        only_external: 1,
        limit: 6,
      },
      headers: { 'x-hasura-role': activeRole! },
    });

    if (data.statusCode === 200) {
      setListUser(data.data);
      setPage(data.currentPage);
      setTotalDataUser(data.total);
      setHasNextPage(data.hasNextPage);

      const pagesNumber = Math.ceil(data.total / data.limit);
      setPageNumber(pagesNumber);

      setLoadingUser(false);
    }
  };

  const handleChangeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const selectedUserMsg = async (el: UserDataTracks) => {
    const values = {
      correspondance_category_id: corespondence.toUpperCase(),
      messages: [
        {
          content: null,
          created_at: new Date().toISOString(),
        },
      ],
      participant1: {
        id: user?.id,
        employee_name: user?.firstName,
        roles: activeRole,
        is_online: null,
        last_login: new Date().toISOString(),
      },
      participant2: {
        id: el.id,
        employee_name: el.employee_name,
        roles: `tender_${el.roles[0].user_type_id.toLowerCase()}`,
        is_online: el.is_online,
        last_login: el.last_login,
      },
    };

    onSubmit(values);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    [
      'tender_project_manager',
      'tender_consultant',
      'tender_ceo',
      'tender_finance',
      'tender_cashier',
    ].includes(activeRole)
      ? findUserExternal()
      : getAllProposalTracks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Stack component="div" spacing={2} direction="column">
        {[
          'tender_project_manager',
          'tender_consultant',
          'tender_ceo',
          'tender_finance',
          'tender_cashier',
        ].includes(activeRole) ? (
          <>
            <Typography>{translate('new_message_modal.form.label.search_employee')}</Typography>
            <TextField
              autoFocus
              placeholder="ex. Mohammad Zayin"
              size="small"
              onChange={handleChangeSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: 'text.disabled', width: 20, height: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </>
        ) : (
          <>
            <Typography>{translate('new_message_modal.form.label.track_type')}</Typography>
            <TextField
              select
              fullWidth
              size="small"
              label={translate('content.messages.text_field.placeholder_list_tracks')}
              value={selectedTrack}
              onChange={handleChange}
            >
              {listTrack &&
                listTrack.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
            </TextField>
          </>
        )}
        <Typography sx={{ pt: 1 }}>
          {translate('new_message_modal.form.label.employees')}
        </Typography>
        {loadingUser ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              pb: 2,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Grid container spacing={2} sx={{ pb: 1 }}>
              {listUser
                .filter((el) => el.employee_name.toLowerCase().includes(searchValue.toLowerCase()))
                .map((v, i) => (
                  <Grid item xs={6} key={i}>
                    <Stack
                      direction="row"
                      component="div"
                      alignItems="center"
                      alignContent="space-between"
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '10px',
                        px: 1.5,
                        py: 1,
                        backgroundColor: theme.palette.grey[200],
                        '&:hover': {
                          color: '#fff',
                          backgroundColor: 'background.paper',
                          '& > .MuiIconButton-root': {
                            color: theme.palette.common.white,
                          },
                        },
                      }}
                      justifyContent="space-between"
                      onClick={() => selectedUserMsg(v)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          src="/assets/icons/users-alt-green.svg"
                          alt="user_icons"
                          sx={{ mr: 2 }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            {v.employee_name}
                          </Typography>
                          <Typography variant="caption">{v.roles[0].user_type_id}</Typography>
                        </Box>
                      </Box>
                      <IconButton sx={{ color: theme.palette.grey[600] }}>
                        <Iconify icon={'eva:message-circle-fill'} width={24} height={24} />
                      </IconButton>
                    </Stack>
                  </Grid>
                ))}
              {!listUser.filter((el) =>
                el.employee_name.toLowerCase().includes(searchValue.toLowerCase())
              ).length && (
                <Label
                  color="warning"
                  sx={{ mx: 2, mt: 2, mb: 1, py: 2, px: 1.5, fontStyle: 'italic' }}
                  startIcon={<Iconify icon={'eva:info-outline'} width={16} height={16} />}
                >
                  {translate('content.messages.empty_user_data')}
                </Label>
              )}
            </Grid>
            {listUser.filter((el) =>
              el.employee_name.toLowerCase().includes(searchValue.toLowerCase())
            ).length ? (
              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="flex-start"
                sx={{ mt: 3, mb: 1 }}
              >
                {Array.from(Array(pageNumber).keys()).map((elem, index) => (
                  <Button
                    key={index}
                    size="small"
                    sx={{
                      color: index === page - 1 ? '#fff' : 'rgba(147, 163, 176, 0.8)',
                      backgroundColor:
                        index === page - 1 ? 'background.paper' : 'rgba(147, 163, 176, 0.16)',
                      '&:hover': {
                        color: theme.palette.common.white,
                      },
                      minWidth: 30,
                      borderRadius: 0.25,
                    }}
                    onClick={() => paginateUserList(elem + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Stack>
            ) : null}
          </Box>
        )}
      </Stack>
    </FormProvider>
  );
}

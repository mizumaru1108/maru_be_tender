// React
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import axiosInstance from 'utils/axios';
// component
import { Box, Button, Grid, Stack, TextField, Typography, MenuItem, CircularProgress, useTheme, IconButton } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import Label from 'components/Label';
import Iconify from 'components/Iconify';
import Image from 'components/Image';
// types
import { NewMessageModalFormProps, NewMessageModalFormValues, UserDataTracks } from './types';

export default function NewMessageModalForm({ children, onSubmit }: NewMessageModalFormProps) {
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const theme = useTheme();

  const [listTrack, setListTrack] = useState<{ id?: string}[] | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  // User Data
  const [listUser, setListUser] = useState<UserDataTracks[] | []>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);

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
    const { data } = await axiosInstance.get(
      '/tender-proposal/fetch-track',
      { headers: { 'x-hasura-role': activeRole! } }
    );

    if (data.statusCode === 200) {
      setListTrack(data.data);
    }
  }

  const findUserTracks = async (employee_path: string) => {
    setLoadingUser(true);
    
    const { data } = await axiosInstance.get(
      '/tender-user/find-users',
      {
        params: {
          employee_path: employee_path,
          limit: 6,
        },
        headers: { 'x-hasura-role': activeRole! }
      }
    );

    if (data.statusCode === 200) {      
      setListUser(data.data);
      setLoadingUser(false);

      setPage(data.currentPage);
      setTotalDataUser(data.total);
      setHasNextPage(data.hasNextPage);

      const pagesNumber = Math.ceil(data.total / data.limit);
      setPageNumber(pagesNumber);
    }
  }

  const paginateUserList = async (elem: number) => {
    setLoadingUser(true);
    
    const { data } = await axiosInstance.get(
      '/tender-user/find-users',
      {
        params: {
          employee_path: selectedTrack,
          page: elem,
          limit: 6,
        },
        headers: { 'x-hasura-role': activeRole! }
      }
    );

    if (data.statusCode === 200) {      
      setListUser(data.data);
      setLoadingUser(false);

      setPage(data.currentPage);
      setTotalDataUser(data.total);
      setHasNextPage(data.hasNextPage);

      const pagesNumber = Math.ceil(data.total / data.limit);
      setPageNumber(pagesNumber);
    }
  }
  
  useEffect(() => {
    window.scrollTo(0, 0);

    getAllProposalTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      {!listTrack ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Stack component="div" spacing={2} direction="column">
          <Typography>
            {translate('new_message_modal.form.label.track_type')}
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            label={translate('content.messages.text_field.placeholder_list_tracks')}
            value={selectedTrack}
            onChange={handleChange}
          >
            {listTrack.map((option, index) => (
              <MenuItem key={index} value={option.id}>
                {option.id}
              </MenuItem>
            ))}
          </TextField>
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
                pb: 2
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {!listUser.length ? (
                <Label
                  color="warning"
                  sx={{ mr: 1, mb: 1, py: 2, px: 1.5, fontStyle: 'italic' }}
                  startIcon={<Iconify icon={'eva:info-outline'} width={16} height={16} />}
                >
                  {translate('content.messages.empty_user_data')}
                </Label>
              ) : (
                <>
                  <Grid container spacing={2} sx={{ pb: 1 }}>
                    {listUser.map((v, i) => (
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
                                color: theme.palette.common.white
                              }
                            },
                          }}
                          justifyContent="space-between"
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
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
                              <Typography variant="caption">
                                {v.roles[0].user_type_id}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton sx={{ color: theme.palette.grey[600] }}>
                            <Iconify
                              icon={'eva:message-circle-fill'}
                              width={24}
                              height={24}
                            />
                          </IconButton>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                  <Stack direction="row" spacing={1.5} justifyContent="flex-start" sx={{ mt: 3, mb: 1 }}>
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
                </>
              )}
            </Box>
          )}
        </Stack>
      )}
    </FormProvider>
  );
}

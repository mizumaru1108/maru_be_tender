import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router';
import EmptyContent from '../../../components/EmptyContent';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';

interface IClients {
  employee_name: string;
  id: string;
}

type Props = {
  handleOnOpen: () => void;
  // open: boolean;
  handleSetId: (id: string) => void;
  handleSetPartnerName: (partnerName: string) => void;
};
function StepOne({ handleOnOpen, handleSetId, handleSetPartnerName }: Props) {
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [clientField, setClientField] = React.useState<string>('main');
  const [clientName, setClientName] = React.useState<string>('');
  const [clients, setClients] = React.useState<IClients[]>([]);

  //pagination
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const handleKeyupMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
      setCount(0);
      fetchingClients();
    }
  };

  const fetchingClients = async () => {
    setClients([]);
    setIsLoading(true);
    try {
      const apiFindClients = `/tender-user/find-users?page=${page}&client_field=${clientField}&hide_internal=1`;
      const apiFindClient = `/tender-user/find-users?page=${page}&employee_name=${clientName}&client_field=${clientField}&hide_internal=1`;
      const res = await axiosInstance.get(clientName ? apiFindClient : apiFindClients, {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log(res.data);
      setCount(res.data.total ? Math.ceil(res.data.total / 10) : 0);
      setClients(res.data.data);
      // navigate('/');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  React.useEffect(() => {
    fetchingClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  // console.log({ clients });
  return (
    <>
      <Grid item md={12} xs={12}>
        <IconButton
          onClick={() => {
            // setUserId('');
            navigate(-1);
          }}
        >
          <svg
            width="42"
            height="41"
            viewBox="0 0 42 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40.6799"
              height="41.53"
              rx="2"
              transform="matrix(-1.19249e-08 -1 -1 1.19249e-08 41.5312 40.6798)"
              fill="#93A3B0"
              fill-opacity="0.24"
            />
            <path
              d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
              fill="#1E1E1E"
            />
          </svg>
        </IconButton>
      </Grid>
      <Grid item md={12} xs={12}>
        <Typography variant="h5">{translate('appointments_with_partners')}</Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        <Box sx={{ padding: '20px', width: '100%' }}>
          <Grid container spacing={5}>
            <Grid item md={12} xs={12}>
              <TextField
                InputLabelProps={{ shrink: true }}
                select
                fullWidth
                SelectProps={{ native: true }}
                defaultValue={clientField}
                onChange={(e) => {
                  if (open && clientField) {
                    setPage(1);
                    setCount(0);
                    setClients([]);
                    setClientName('');
                    setOpen(!open);
                  }
                  setClientField(e.target.value);
                }}
              >
                <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                  {translate('please_choose_entity_field')}
                </option>
                <option value="main" style={{ backgroundColor: '#fff' }}>
                  {translate('entity_field_main')}
                </option>
                <option value="sub" style={{ backgroundColor: '#fff' }}>
                  {translate('entity_field_sub_main')}
                </option>
              </TextField>
            </Grid>
            {clientField && (
              <Grid item md={12} xs={12}>
                <Stack direction="column" gap={1}>
                  <Button
                    sx={{
                      padding: '15px',
                      borderRadius: '1.5',
                      border: '1.5 solid',
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: '#fff',
                      color: '#000',
                      borderColor: '#000',
                      ':hover': { backgroundColor: '#fff' },
                    }}
                    endIcon={
                      <>
                        <svg
                          width="16"
                          height="8"
                          viewBox="0 0 16 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.8513 0.00457954C14.701 0.00372791 14.552 0.0319624 14.4129 0.0876627C14.2737 0.143363 14.1472 0.225434 14.0405 0.32917L8.80988 5.46666C8.70371 5.57156 8.5774 5.65483 8.43823 5.71166C8.29906 5.76848 8.14979 5.79774 7.99903 5.79774C7.84826 5.79774 7.69899 5.76848 7.55982 5.71166C7.42065 5.65483 7.29434 5.57156 7.18817 5.46666L1.95758 0.32917C1.74253 0.118406 1.45085 4.76837e-07 1.14672 4.76837e-07C0.842593 4.76837e-07 0.55092 0.118406 0.335868 0.32917C0.120815 0.539934 0 0.825792 0 1.12386C0 1.27144 0.0296612 1.41759 0.0872895 1.55394C0.144918 1.69029 0.229384 1.81419 0.335868 1.91854L5.57788 7.04484C6.22878 7.65772 7.0964 8 7.99903 8C8.90165 8 9.76927 7.65772 10.4202 7.04484L15.6622 1.91854C15.7692 1.81449 15.8542 1.6907 15.9122 1.55431C15.9701 1.41791 16 1.27162 16 1.12386C16 0.976099 15.9701 0.829803 15.9122 0.693409C15.8542 0.557015 15.7692 0.433221 15.6622 0.32917C15.5555 0.225434 15.4289 0.143363 15.2898 0.0876627C15.1506 0.0319624 15.0016 0.00372791 14.8513 0.00457954Z"
                            fill="#1E1E1E"
                          />
                        </svg>
                      </>
                    }
                    onClick={() => {
                      handleOnOpen();
                      setPage(1);
                      setCount(0);
                      setClientName('');
                      fetchingClients();
                      if (!open) {
                        setOpen(true);
                      } else {
                        setOpen(false);
                      }
                    }}
                  >
                    {translate('please_choose_the_name_of_the_client')}
                  </Button>
                  {open && (
                    <Box
                      sx={{
                        padding: '20px',
                        backgroundColor: '#fff',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        borderRadius: '1.5',
                        border: '1.5 solid',
                      }}
                    >
                      <TextField
                        value={clientName}
                        autoFocus={open}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  // console.log('asdasd');
                                  fetchingClients();
                                }}
                                edge="end"
                              >
                                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.primary' }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ width: '100%', mb: 2 }}
                        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyupMsg(e)}
                        onChange={(e) => {
                          // console.log(e.target.value);
                          setClientName(e.target.value);
                        }}
                        placeholder={translate('write_name_to_search')}
                      />
                      {isLoading && (
                        <Box
                          sx={{
                            width: '100%',
                            mt: 2,
                            // height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      )}
                      {!isLoading && clients.length > 0 && (
                        <>
                          <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
                            {clients.map((item, index) => (
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                key={index}
                                sx={{ width: '100%' }}
                              >
                                <Typography
                                  sx={{ fontWeight: 500, fontSize: '15px', alignSelf: 'center' }}
                                >
                                  {item.employee_name}
                                </Typography>
                                <Button
                                  sx={{
                                    px: '20px',
                                    py: '0px',
                                    borderColor: '#0E8478',
                                    border: '1px solid rgba(14, 132, 120, 0.5)',
                                    color: '#0E8478',
                                    backgroundColor: '#fff',
                                    ':hover': { backgroundColor: '#fff' },
                                    alignItems: 'inherit',
                                    borderRadius: '1.5 !important',
                                  }}
                                  startIcon={
                                    <div>
                                      <svg
                                        width="24"
                                        height="16"
                                        viewBox="0 0 24 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M14 6.999V9.999C14 10.551 13.552 10.999 13 10.999C12.448 10.999 12 10.551 12 9.999V7.413L7.707 11.706C7.512 11.901 7.256 11.999 7 11.999C6.744 11.999 6.488 11.901 6.293 11.706C5.902 11.315 5.902 10.683 6.293 10.292L10.586 5.999H8C7.448 5.999 7 5.551 7 4.999C7 4.447 7.448 3.999 8 3.999H11C12.654 3.999 14 5.345 14 6.999ZM24 4.312V11.631C24 12.387 23.58 13.068 22.903 13.406C22.62 13.547 22.316 13.617 22.014 13.617C21.594 13.617 21.177 13.482 20.825 13.218C20.787 13.19 20.752 13.159 20.719 13.126L18.963 11.372C18.769 13.953 16.63 16 14.001 16H5C2.243 16 0 13.757 0 11V5C0 2.243 2.243 0 5 0H14C16.618 0 18.748 2.029 18.959 4.594L20.715 2.822C20.75 2.787 20.786 2.756 20.825 2.726C21.43 2.272 22.226 2.201 22.903 2.538C23.579 2.876 24 3.557 24 4.313V4.312ZM17 4.999C17 3.345 15.654 1.999 14 1.999H5C3.346 1.999 2 3.345 2 4.999V10.999C2 12.653 3.346 13.999 5 13.999H14C15.654 13.999 17 12.653 17 10.999V4.999ZM22.025 11.604L22 4.365L19 7.393V8.582L22.025 11.604Z"
                                          fill="#0E8478"
                                        />
                                      </svg>
                                    </div>
                                  }
                                  onClick={() => {
                                    handleSetPartnerName(item.employee_name);
                                    handleSetId(item.id);
                                  }}
                                >
                                  {translate('booking_an_appointment')}
                                </Button>
                              </Stack>
                            ))}
                            <Pagination
                              count={count}
                              page={page}
                              color="primary"
                              onChange={handleChange}
                            />
                          </Stack>
                        </>
                      )}
                      {!isLoading && clients.length === 0 && (
                        <EmptyContent
                          title="No Data"
                          sx={{
                            '& span.MuiBox-root': { height: 160 },
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </>
  );
}

export default StepOne;

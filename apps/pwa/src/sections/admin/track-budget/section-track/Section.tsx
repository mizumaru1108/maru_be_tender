// react
import { useState } from 'react';
import { useParams } from 'react-router';
// @mui + material
import { Button, Grid, Stack, Typography, Box } from '@mui/material';
// component
import ModalDialog from 'components/modal-dialog';
import { LoadingButton } from '@mui/lab';
import EditSection from './EditSection';
// utils
import axiosInstance from 'utils/axios';
import { fCurrencyNumber } from 'utils/formatNumber';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
//
import { useSnackbar } from 'notistack';

// ------------------------------------------------------------------------------------------

interface IPropsSection {
  item: {
    id: string;
    name: string;
    budget: number;
  };
}

// ------------------------------------------------------------------------------------------

export default function Section({ item }: IPropsSection) {
  const params = useParams();
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEditSection, setOpenEditSection] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async () => {
    setLoadingDelete(true);

    try {
      const { status } = await axiosInstance.patch(
        '/tender/proposal/payment/delete-track-budget',
        { id: item.id },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        enqueueSnackbar(
          translate('pages.admin.tracks_budget.notification.success_delete_section'),
          {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          }
        );

        setOpenDelete(false);
        setLoadingDelete(false);
        // window.location.reload();
      }
    } catch (err) {
      if (typeof err.message === 'object') {
        err.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
        enqueueSnackbar(
          `${
            statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
          }`,
          {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          }
        );
      }

      setLoadingDelete(false);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <ModalDialog
        styleContent={{ p: 4, backgroundColor: '#fff' }}
        isOpen={openDelete}
        maxWidth="sm"
        content={
          <Stack
            direction="column"
            spacing={3}
            alignItems="center"
            justifyContent="center"
            component="div"
          >
            <Typography variant="h6">
              <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                {translate('pages.admin.tracks_budget.notification.confirm_delete')}&nbsp;
              </Typography>
              <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                "{translate(`${item.name}`)}" {translate('project_management_headercell.section')}
                &nbsp;?
              </Typography>
            </Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LoadingButton
                loading={loadingDelete}
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={handleDelete}
              >
                {translate('review.yes')}
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDelete(false);
                  setLoadingDelete(false);
                }}
                color="primary"
              >
                {translate('review.no')}
              </Button>
            </Box>
          </Stack>
        }
        onClose={() => {
          setOpenDelete(false);
          setLoadingDelete(false);
        }}
      />

      <ModalDialog
        styleContent={{ p: 4, backgroundColor: '#fff' }}
        isOpen={openEditSection}
        title={`${translate('pages.admin.tracks_budget.heading.edit_section')} "${item.name}"`}
        maxWidth="sm"
        content={<EditSection tracks={item} onClose={() => setOpenEditSection(false)} />}
        onClose={() => {
          setOpenEditSection(false);
        }}
      />
      <Grid item md={12} xs={12}>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ alignSelf: 'center' }}>
              {item.name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Stack component="div" direction="row" spacing={1}>
              <Typography sx={{ fontSize: '17px' }} color={'#93A3B0'}>
                {translate('pages.admin.tracks_budget.heading.full_budget')}
              </Typography>
              <Typography sx={{ fontSize: '17px', fontWeight: 700 }} color="#0E8478">
                {fCurrencyNumber(item.budget)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack direction="row" component="div" spacing={1.5} justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#0169DE',
                  color: '#fff',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
                startIcon={
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2224_42114)">
                      <path
                        d="M15.4018 0.769209C14.9486 0.316673 14.3343 0.0625 13.6938 0.0625C13.0534 0.0625 12.4391 0.316673 11.9858 0.769209L1.14318 11.6119C0.832682 11.9206 0.586489 12.2879 0.418846 12.6924C0.251203 13.0969 0.165439 13.5307 0.166514 13.9685V15.3372C0.166514 15.514 0.236752 15.6836 0.361776 15.8086C0.4868 15.9336 0.65637 16.0039 0.833181 16.0039H2.20185C2.63969 16.0051 3.07343 15.9195 3.47795 15.752C3.88248 15.5844 4.24975 15.3383 4.55851 15.0279L15.4018 4.18454C15.8542 3.73134 16.1082 3.11719 16.1082 2.47688C16.1082 1.83657 15.8542 1.22241 15.4018 0.769209ZM3.61585 14.0852C3.23985 14.4587 2.73182 14.669 2.20185 14.6705H1.49985V13.9685C1.49917 13.7058 1.55062 13.4456 1.65121 13.2028C1.75179 12.9601 1.89952 12.7398 2.08585 12.5545L10.3145 4.32588L11.8478 5.85921L3.61585 14.0852ZM14.4585 3.24188L12.7878 4.91321L11.2545 3.38321L12.9258 1.71188C13.0265 1.61141 13.146 1.53177 13.2775 1.47748C13.4089 1.4232 13.5498 1.39534 13.692 1.39549C13.8343 1.39565 13.9751 1.42381 14.1064 1.47838C14.2377 1.53296 14.3571 1.61286 14.4575 1.71354C14.558 1.81422 14.6376 1.9337 14.6919 2.06517C14.7462 2.19663 14.7741 2.33749 14.7739 2.47972C14.7737 2.62195 14.7456 2.76275 14.691 2.8941C14.6364 3.02544 14.5565 3.14475 14.4558 3.24521L14.4585 3.24188Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2224_42114">
                        <rect width="16" height="16" fill="white" transform="translate(0.166504)" />
                      </clipPath>
                    </defs>
                  </svg>
                }
                onClick={() => setOpenEditSection(true)}
                size="medium"
              >
                {translate('pages.admin.tracks_budget.btn.amandment')}
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF4842',
                  color: '#fff',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
                startIcon={
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2224_42108)">
                      <path
                        d="M14.1667 2.66667H12.1C11.9453 1.91428 11.5359 1.23823 10.9408 0.752479C10.3458 0.266727 9.60147 0.000969683 8.83333 0L7.5 0C6.73186 0.000969683 5.98755 0.266727 5.3925 0.752479C4.79745 1.23823 4.38806 1.91428 4.23333 2.66667H2.16667C1.98986 2.66667 1.82029 2.7369 1.69526 2.86193C1.57024 2.98695 1.5 3.15652 1.5 3.33333C1.5 3.51014 1.57024 3.67971 1.69526 3.80474C1.82029 3.92976 1.98986 4 2.16667 4H2.83333V12.6667C2.83439 13.5504 3.18592 14.3976 3.81081 15.0225C4.43571 15.6474 5.28294 15.9989 6.16667 16H10.1667C11.0504 15.9989 11.8976 15.6474 12.5225 15.0225C13.1474 14.3976 13.4989 13.5504 13.5 12.6667V4H14.1667C14.3435 4 14.513 3.92976 14.6381 3.80474C14.7631 3.67971 14.8333 3.51014 14.8333 3.33333C14.8333 3.15652 14.7631 2.98695 14.6381 2.86193C14.513 2.7369 14.3435 2.66667 14.1667 2.66667ZM7.5 1.33333H8.83333C9.24685 1.33384 9.65008 1.46225 9.98774 1.70096C10.3254 1.93967 10.5809 2.27699 10.7193 2.66667H5.614C5.75239 2.27699 6.00793 1.93967 6.34559 1.70096C6.68325 1.46225 7.08648 1.33384 7.5 1.33333ZM12.1667 12.6667C12.1667 13.1971 11.956 13.7058 11.5809 14.0809C11.2058 14.456 10.6971 14.6667 10.1667 14.6667H6.16667C5.63623 14.6667 5.12753 14.456 4.75245 14.0809C4.37738 13.7058 4.16667 13.1971 4.16667 12.6667V4H12.1667V12.6667Z"
                        fill="white"
                      />
                      <path
                        d="M6.83317 11.9974C7.00998 11.9974 7.17955 11.9272 7.30457 11.8021C7.4296 11.6771 7.49984 11.5075 7.49984 11.3307V7.33073C7.49984 7.15392 7.4296 6.98435 7.30457 6.85932C7.17955 6.7343 7.00998 6.66406 6.83317 6.66406C6.65636 6.66406 6.48679 6.7343 6.36177 6.85932C6.23674 6.98435 6.1665 7.15392 6.1665 7.33073V11.3307C6.1665 11.5075 6.23674 11.6771 6.36177 11.8021C6.48679 11.9272 6.65636 11.9974 6.83317 11.9974Z"
                        fill="white"
                      />
                      <path
                        d="M9.49967 11.9974C9.67649 11.9974 9.84605 11.9272 9.97108 11.8021C10.0961 11.6771 10.1663 11.5075 10.1663 11.3307V7.33073C10.1663 7.15392 10.0961 6.98435 9.97108 6.85932C9.84605 6.7343 9.67649 6.66406 9.49967 6.66406C9.32286 6.66406 9.15329 6.7343 9.02827 6.85932C8.90325 6.98435 8.83301 7.15392 8.83301 7.33073V11.3307C8.83301 11.5075 8.90325 11.6771 9.02827 11.8021C9.15329 11.9272 9.32286 11.9974 9.49967 11.9974Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2224_42108">
                        <rect width="16" height="16" fill="white" transform="translate(0.166504)" />
                      </clipPath>
                    </defs>
                  </svg>
                }
                onClick={() => setOpenDelete(true)}
                size="medium"
              >
                {translate('pages.admin.tracks_budget.btn.delete')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

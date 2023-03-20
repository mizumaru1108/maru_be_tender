/* eslint-disable @typescript-eslint/no-unused-vars */
// @mui
import { Button, Checkbox, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
//
import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { stringTruncate } from '../../../../utils/stringTruncate';
import { AppointmentsTableColumn } from './appointments';
import CheckIcon from '@mui/icons-material/Check';
import ConfirmationModal from '../../../modal-dialog/ConfirmationModal';
import RejectionModal from '../../../modal-dialog/RejectionModal';

export default function AppointmentsTableRow({ row, isRequest }: AppointmentsTableColumn) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const location = useLocation();

  const [openAcc, setOpenAcc] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);

  const handleReject = async (data: any) => {
    console.log('reject data:', data);
  };

  const handleAccept = async () => {
    console.log('accept');
  };

  // const theme = useTheme();

  return (
    <>
      <TableRow>
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {row.id ?? '-'}
          </Typography>
        </TableCell>
        {/* <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {row.projectName ? stringTruncate(row.projectName, 23) : '-'}
        </Typography>
      </TableCell> */}
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {/* it should be the entity */}
            {row.meetingTime ?? '-'}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {/* it should be the entity */}
            {row.employee ?? '-'}
          </Typography>
        </TableCell>
        <TableCell align="left">
          {!isRequest ? (
            <Button
              startIcon={
                <div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.6627 5.31061L7.30267 0.643942C6.80593 0.280198 6.21815 0.0611376 5.60451 0.0110503C4.99087 -0.0390371 4.37535 0.0818059 3.8262 0.36018C3.27704 0.638553 2.81572 1.06358 2.49337 1.58813C2.17103 2.11268 2.00026 2.71626 2 3.33194V12.6653C2.00011 13.2812 2.17089 13.8851 2.49338 14.4099C2.81588 14.9347 3.27748 15.3599 3.82695 15.6382C4.37642 15.9166 4.99227 16.0372 5.60616 15.9868C6.22006 15.9364 6.80797 15.7169 7.30467 15.3526L13.6647 10.6859C14.0868 10.3763 14.4302 9.97165 14.6668 9.50465C14.9035 9.03765 15.0268 8.52148 15.0268 7.99794C15.0268 7.47441 14.9035 6.95823 14.6668 6.49124C14.4302 6.02424 14.0868 5.61954 13.6647 5.30994L13.6627 5.31061ZM12.8733 9.61061L6.51333 14.2773C6.21534 14.495 5.86291 14.6261 5.49505 14.6559C5.12718 14.6858 4.75824 14.6132 4.42904 14.4464C4.09985 14.2795 3.82326 14.0248 3.62987 13.7104C3.43648 13.3961 3.33385 13.0343 3.33333 12.6653V3.33194C3.32963 2.96217 3.43033 2.59886 3.62385 2.28376C3.81737 1.96865 4.09587 1.71454 4.42733 1.55061C4.70926 1.4072 5.02103 1.33229 5.33733 1.33194C5.76126 1.33356 6.17348 1.4712 6.51333 1.72461L12.8733 6.39127C13.1263 6.57707 13.332 6.81981 13.4738 7.09985C13.6156 7.3799 13.6895 7.68938 13.6895 8.00327C13.6895 8.31717 13.6156 8.62665 13.4738 8.9067C13.332 9.18674 13.1263 9.42948 12.8733 9.61528V9.61061Z"
                      fill="#0E8478"
                    />
                  </svg>
                </div>
              }
              sx={{
                backgroundColor: '#fff',
                color: '#0E8478',
                borderRadius: '10px',
                '&:hover': { backgroundColor: '#fff' },
                px: '15px',
                py: '0px',
                height: '45px',
                fontSize: '15px',
              }}
              variant="outlined"
              onClick={() => console.log('asdlamsdkl')}
            >
              بدء الاجتماع
            </Button>
          ) : (
            <Stack direction="row" flex={2} gap={2} justifyContent="end">
              <Button
                startIcon={
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_4518_47157)">
                        <path
                          d="M13.9999 2.66667H11.9333C11.7785 1.91428 11.3691 1.23823 10.7741 0.752479C10.179 0.266727 9.43472 0.000969683 8.66659 0L7.33325 0C6.56512 0.000969683 5.8208 0.266727 5.22575 0.752479C4.63071 1.23823 4.22132 1.91428 4.06659 2.66667H1.99992C1.82311 2.66667 1.65354 2.7369 1.52851 2.86193C1.40349 2.98695 1.33325 3.15652 1.33325 3.33333C1.33325 3.51014 1.40349 3.67971 1.52851 3.80474C1.65354 3.92976 1.82311 4 1.99992 4H2.66659V12.6667C2.66764 13.5504 3.01917 14.3976 3.64407 15.0225C4.26896 15.6474 5.11619 15.9989 5.99992 16H9.99992C10.8836 15.9989 11.7309 15.6474 12.3558 15.0225C12.9807 14.3976 13.3322 13.5504 13.3333 12.6667V4H13.9999C14.1767 4 14.3463 3.92976 14.4713 3.80474C14.5963 3.67971 14.6666 3.51014 14.6666 3.33333C14.6666 3.15652 14.5963 2.98695 14.4713 2.86193C14.3463 2.7369 14.1767 2.66667 13.9999 2.66667ZM7.33325 1.33333H8.66659C9.0801 1.33384 9.48334 1.46225 9.82099 1.70096C10.1587 1.93967 10.4142 2.27699 10.5526 2.66667H5.44725C5.58564 2.27699 5.84119 1.93967 6.17884 1.70096C6.5165 1.46225 6.91974 1.33384 7.33325 1.33333ZM11.9999 12.6667C11.9999 13.1971 11.7892 13.7058 11.4141 14.0809C11.0391 14.456 10.5304 14.6667 9.99992 14.6667H5.99992C5.46949 14.6667 4.96078 14.456 4.58571 14.0809C4.21063 13.7058 3.99992 13.1971 3.99992 12.6667V4H11.9999V12.6667Z"
                          fill="white"
                        />
                        <path
                          d="M6.66667 12.0003C6.84348 12.0003 7.01305 11.9301 7.13807 11.8051C7.2631 11.68 7.33333 11.5105 7.33333 11.3337V7.33366C7.33333 7.15685 7.2631 6.98728 7.13807 6.86225C7.01305 6.73723 6.84348 6.66699 6.66667 6.66699C6.48986 6.66699 6.32029 6.73723 6.19526 6.86225C6.07024 6.98728 6 7.15685 6 7.33366V11.3337C6 11.5105 6.07024 11.68 6.19526 11.8051C6.32029 11.9301 6.48986 12.0003 6.66667 12.0003Z"
                          fill="white"
                        />
                        <path
                          d="M9.33341 12.0003C9.51023 12.0003 9.67979 11.9301 9.80482 11.8051C9.92984 11.68 10.0001 11.5105 10.0001 11.3337V7.33366C10.0001 7.15685 9.92984 6.98728 9.80482 6.86225C9.67979 6.73723 9.51023 6.66699 9.33341 6.66699C9.1566 6.66699 8.98703 6.73723 8.86201 6.86225C8.73699 6.98728 8.66675 7.15685 8.66675 7.33366V11.3337C8.66675 11.5105 8.73699 11.68 8.86201 11.8051C8.98703 11.9301 9.1566 12.0003 9.33341 12.0003Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4518_47157">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                }
                onClick={() => setOpenReject(!openReject)}
                sx={{
                  color: '#fff',
                  backgroundColor: '#FF4842',
                  ':hover': { backgroundColor: '#FF170F' },
                }}
              >
                حذف
              </Button>
              <Button
                startIcon={<CheckIcon />}
                sx={{
                  backgroundColor: 'background.paper',
                  color: '#fff',
                  borderRadius: '10px',
                  px: '15px',
                  py: '0px',
                  height: '45px',
                  fontSize: '15px',
                }}
                variant="outlined"
                onClick={() => setOpenAcc(!openAcc)}
              >
                قبول الموعد
              </Button>
            </Stack>
          )}
        </TableCell>
      </TableRow>
      <ConfirmationModal
        open={openAcc}
        handleClose={() => setOpenAcc(!openAcc)}
        onSumbit={handleAccept}
        message={'Accept Appointment Meeting'}
      />
      <RejectionModal
        open={openReject}
        handleClose={() => setOpenReject(!openReject)}
        onReject={(data) => handleReject(data)}
        message={'Accept Appointment Meeting'}
        key={'reject'}
      />
    </>
  );
}

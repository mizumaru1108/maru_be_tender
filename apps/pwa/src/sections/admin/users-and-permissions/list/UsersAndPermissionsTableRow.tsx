import { Avatar, Checkbox, TableRow, TableCell, Typography, Stack, Chip } from '@mui/material';
import Label from '../../../../components/Label';
import { UsersAndPermissionsInterface } from './types';
import { LoadingButton } from '@mui/lab';
// hooks
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

type Props = {
  row: UsersAndPermissionsInterface;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  isDeleting: { id: string; loading: boolean };
};

export default function UsersAndPermissionsTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  isDeleting,
}: Props) {
  const { name, email, activation, permissions } = row;
  const { translate } = useLocales();

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">{email}</TableCell>
      <TableCell align="left">
        <Stack direction="row" gap={1}>
          {permissions.map((item, index) => (
            <Chip key={index} label={translate(`tender_${item.role.toLowerCase()}`)} />
          ))}
        </Stack>
      </TableCell>
      <TableCell align="left">
        {activation === 'ACTIVE_ACCOUNT' ? (
          <Typography color="green">نشط</Typography>
        ) : (
          <Typography color="red">معطل</Typography>
        )}
      </TableCell>
      <TableCell align="left">
        <Stack direction="row" gap={2}>
          <LoadingButton
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_398_3192)">
                    <path
                      d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47318 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303V0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_398_3192">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            sx={{
              backgroundColor: '#0169DE',
              color: '#fff',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#1482FE' },
              px: '7px',
              py: '0px',
              height: '45px',
              fontSize: '12px',
            }}
            // onClick={() => console.log('asdlamsdkl')}
            onClick={onEditRow}
          >
            تعديل
          </LoadingButton>
          <LoadingButton
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_3374_41161)">
                    <path
                      d="M14 2.66667H11.9333C11.7786 1.91428 11.3692 1.23823 10.7742 0.752479C10.1791 0.266727 9.43481 0.000969683 8.66668 0L7.33334 0C6.56521 0.000969683 5.82089 0.266727 5.22584 0.752479C4.6308 1.23823 4.22141 1.91428 4.06668 2.66667H2.00001C1.8232 2.66667 1.65363 2.7369 1.52861 2.86193C1.40358 2.98695 1.33334 3.15652 1.33334 3.33333C1.33334 3.51014 1.40358 3.67971 1.52861 3.80474C1.65363 3.92976 1.8232 4 2.00001 4H2.66668V12.6667C2.66774 13.5504 3.01926 14.3976 3.64416 15.0225C4.26905 15.6474 5.11628 15.9989 6.00001 16H10C10.8837 15.9989 11.731 15.6474 12.3559 15.0225C12.9808 14.3976 13.3323 13.5504 13.3333 12.6667V4H14C14.1768 4 14.3464 3.92976 14.4714 3.80474C14.5964 3.67971 14.6667 3.51014 14.6667 3.33333C14.6667 3.15652 14.5964 2.98695 14.4714 2.86193C14.3464 2.7369 14.1768 2.66667 14 2.66667ZM7.33334 1.33333H8.66668C9.08019 1.33384 9.48343 1.46225 9.82109 1.70096C10.1587 1.93967 10.4143 2.27699 10.5527 2.66667H5.44734C5.58573 2.27699 5.84128 1.93967 6.17894 1.70096C6.51659 1.46225 6.91983 1.33384 7.33334 1.33333ZM12 12.6667C12 13.1971 11.7893 13.7058 11.4142 14.0809C11.0392 14.456 10.5304 14.6667 10 14.6667H6.00001C5.46958 14.6667 4.96087 14.456 4.5858 14.0809C4.21072 13.7058 4.00001 13.1971 4.00001 12.6667V4H12V12.6667Z"
                      fill="white"
                    />
                    <path
                      d="M6.66667 11.9974C6.84348 11.9974 7.01305 11.9272 7.13807 11.8021C7.2631 11.6771 7.33333 11.5075 7.33333 11.3307V7.33073C7.33333 7.15392 7.2631 6.98435 7.13807 6.85932C7.01305 6.7343 6.84348 6.66406 6.66667 6.66406C6.48986 6.66406 6.32029 6.7343 6.19526 6.85932C6.07024 6.98435 6 7.15392 6 7.33073V11.3307C6 11.5075 6.07024 11.6771 6.19526 11.8021C6.32029 11.9272 6.48986 11.9974 6.66667 11.9974Z"
                      fill="white"
                    />
                    <path
                      d="M9.33332 11.9974C9.51013 11.9974 9.6797 11.9272 9.80473 11.8021C9.92975 11.6771 9.99999 11.5075 9.99999 11.3307V7.33073C9.99999 7.15392 9.92975 6.98435 9.80473 6.85932C9.6797 6.7343 9.51013 6.66406 9.33332 6.66406C9.15651 6.66406 8.98694 6.7343 8.86192 6.85932C8.73689 6.98435 8.66666 7.15392 8.66666 7.33073V11.3307C8.66666 11.5075 8.73689 11.6771 8.86192 11.8021C8.98694 11.9272 9.15651 11.9974 9.33332 11.9974Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3374_41161">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            sx={{
              backgroundColor: '#FF4842',
              color: '#fff',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#FF170F' },
              px: '7px',
              py: '0px',
              height: '45px',
              fontSize: '12px',
            }}
            onClick={onDeleteRow}
            loading={isDeleting.id === row.id ? isDeleting.loading : false}
          >
            حذف
          </LoadingButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

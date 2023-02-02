import { Avatar, Box, Checkbox, Grid, Stack, Typography } from '@mui/material';
import { FollowUps } from '../../../@types/proposal';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useDispatch, useSelector } from 'redux/store';
import { setCheckedItems } from 'redux/slices/proposal';

function FollowUpsText(item: FollowUps) {
  const dispatch = useDispatch();

  const { checkedItems } = useSelector((state) => state.proposal);

  const { activeRole } = useAuth();

  const { translate } = useLocales();

  const role = activeRole!;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { checked, value } = event.target;

    if (checked) {
      dispatch(setCheckedItems([...checkedItems, value]));
    } else {
      dispatch(setCheckedItems(checkedItems.filter((selectedId: any) => selectedId !== value)));
    }
  };

  if (role === 'tender_client')
    return (
      <Grid container spacing={1}>
        <Grid item md={1}>
          <Avatar alt="Remy Sharp">
            <svg
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="46" height="46" rx="23" fill="#0E8478" />
              <g clipPath="url(#clip0_1236_10255)">
                <path
                  d="M23 23C23.6922 23 24.3689 22.7947 24.9445 22.4101C25.5201 22.0256 25.9687 21.4789 26.2336 20.8394C26.4985 20.1999 26.5678 19.4961 26.4327 18.8172C26.2977 18.1383 25.9644 17.5146 25.4749 17.0251C24.9854 16.5356 24.3617 16.2023 23.6828 16.0673C23.0039 15.9322 22.3001 16.0015 21.6606 16.2664C21.0211 16.5313 20.4744 16.9799 20.0899 17.5555C19.7053 18.1311 19.5 18.8078 19.5 19.5C19.5009 20.428 19.87 21.3177 20.5261 21.9739C21.1823 22.63 22.072 22.9991 23 23ZM23 17.1667C23.4615 17.1667 23.9126 17.3035 24.2963 17.5599C24.68 17.8163 24.9791 18.1807 25.1557 18.6071C25.3323 19.0334 25.3785 19.5026 25.2885 19.9552C25.1985 20.4078 24.9762 20.8236 24.6499 21.1499C24.3236 21.4762 23.9078 21.6985 23.4552 21.7885C23.0026 21.8785 22.5334 21.8323 22.1071 21.6557C21.6807 21.4791 21.3163 21.18 21.0599 20.7963C20.8035 20.4126 20.6667 19.9615 20.6667 19.5C20.6667 18.8812 20.9125 18.2877 21.3501 17.8501C21.7877 17.4125 22.3812 17.1667 23 17.1667V17.1667Z"
                  fill="white"
                />
                <path
                  d="M23 24.168C21.6081 24.1695 20.2736 24.7231 19.2894 25.7074C18.3052 26.6916 17.7515 28.0261 17.75 29.418C17.75 29.5727 17.8115 29.7211 17.9209 29.8304C18.0303 29.9398 18.1786 30.0013 18.3333 30.0013C18.488 30.0013 18.6364 29.9398 18.7458 29.8304C18.8552 29.7211 18.9167 29.5727 18.9167 29.418C18.9167 28.335 19.3469 27.2964 20.1126 26.5306C20.8784 25.7648 21.917 25.3346 23 25.3346C24.083 25.3346 25.1216 25.7648 25.8874 26.5306C26.6531 27.2964 27.0833 28.335 27.0833 29.418C27.0833 29.5727 27.1448 29.7211 27.2542 29.8304C27.3636 29.9398 27.512 30.0013 27.6667 30.0013C27.8214 30.0013 27.9697 29.9398 28.0791 29.8304C28.1885 29.7211 28.25 29.5727 28.25 29.418C28.2485 28.0261 27.6948 26.6916 26.7106 25.7074C25.7264 24.7231 24.3919 24.1695 23 24.168V24.168Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1236_10255">
                  <rect width="14" height="14" fill="white" transform="translate(16 16)" />
                </clipPath>
              </defs>
            </svg>
          </Avatar>
        </Grid>
        <Grid item md={11}>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography color="#0E8478">{`${item.user.employee_name} - ${translate(
                `permissions.${item.user.roles[0].role}`
              )}`}</Typography>
              <Typography sx={{ color: 'gray' }}>{`${new Date(
                item.created_at
              ).toLocaleString()}`}</Typography>
            </Stack>
            <Typography>{item.content}</Typography>
          </Box>
        </Grid>
      </Grid>
    );
  return (
    <Grid container>
      <Grid item md={1}>
        <Avatar alt="Remy Sharp">
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="46" height="46" rx="23" fill="#0E8478" />
            <g clipPath="url(#clip0_1236_10255)">
              <path
                d="M23 23C23.6922 23 24.3689 22.7947 24.9445 22.4101C25.5201 22.0256 25.9687 21.4789 26.2336 20.8394C26.4985 20.1999 26.5678 19.4961 26.4327 18.8172C26.2977 18.1383 25.9644 17.5146 25.4749 17.0251C24.9854 16.5356 24.3617 16.2023 23.6828 16.0673C23.0039 15.9322 22.3001 16.0015 21.6606 16.2664C21.0211 16.5313 20.4744 16.9799 20.0899 17.5555C19.7053 18.1311 19.5 18.8078 19.5 19.5C19.5009 20.428 19.87 21.3177 20.5261 21.9739C21.1823 22.63 22.072 22.9991 23 23ZM23 17.1667C23.4615 17.1667 23.9126 17.3035 24.2963 17.5599C24.68 17.8163 24.9791 18.1807 25.1557 18.6071C25.3323 19.0334 25.3785 19.5026 25.2885 19.9552C25.1985 20.4078 24.9762 20.8236 24.6499 21.1499C24.3236 21.4762 23.9078 21.6985 23.4552 21.7885C23.0026 21.8785 22.5334 21.8323 22.1071 21.6557C21.6807 21.4791 21.3163 21.18 21.0599 20.7963C20.8035 20.4126 20.6667 19.9615 20.6667 19.5C20.6667 18.8812 20.9125 18.2877 21.3501 17.8501C21.7877 17.4125 22.3812 17.1667 23 17.1667V17.1667Z"
                fill="white"
              />
              <path
                d="M23 24.168C21.6081 24.1695 20.2736 24.7231 19.2894 25.7074C18.3052 26.6916 17.7515 28.0261 17.75 29.418C17.75 29.5727 17.8115 29.7211 17.9209 29.8304C18.0303 29.9398 18.1786 30.0013 18.3333 30.0013C18.488 30.0013 18.6364 29.9398 18.7458 29.8304C18.8552 29.7211 18.9167 29.5727 18.9167 29.418C18.9167 28.335 19.3469 27.2964 20.1126 26.5306C20.8784 25.7648 21.917 25.3346 23 25.3346C24.083 25.3346 25.1216 25.7648 25.8874 26.5306C26.6531 27.2964 27.0833 28.335 27.0833 29.418C27.0833 29.5727 27.1448 29.7211 27.2542 29.8304C27.3636 29.9398 27.512 30.0013 27.6667 30.0013C27.8214 30.0013 27.9697 29.9398 28.0791 29.8304C28.1885 29.7211 28.25 29.5727 28.25 29.418C28.2485 28.0261 27.6948 26.6916 26.7106 25.7074C25.7264 24.7231 24.3919 24.1695 23 24.168V24.168Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_1236_10255">
                <rect width="14" height="14" fill="white" transform="translate(16 16)" />
              </clipPath>
            </defs>
          </svg>
        </Avatar>
      </Grid>
      <Grid item md={11}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={11}>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography color="#0E8478">{`${item.user.employee_name} - ${translate(
                  `permissions.${item.user.roles[0].role}`
                )}`}</Typography>
                <Typography sx={{ color: 'gray' }}>{`${new Date(
                  item.created_at
                ).toLocaleString()}`}</Typography>
              </Stack>
              <Typography>{item.content}</Typography>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Checkbox onChange={(event) => handleCheckboxChange(event, item.id)} value={item.id} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FollowUpsText;

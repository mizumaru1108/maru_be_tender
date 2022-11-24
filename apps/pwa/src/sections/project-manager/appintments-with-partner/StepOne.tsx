import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';

type Props = {
  handleOnOpen: () => void;
  open: boolean;
  handleSetId: (id: string) => void;
};
function StepOne({ handleOnOpen, open, handleSetId }: Props) {
  const { translate } = useLocales();
  return (
    <>
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
                  onClick={handleOnOpen}
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                console.log('asdasd');
                              }}
                              edge="end"
                            >
                              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.primary' }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: '100%' }}
                      onChange={() => {
                        console.log('asdasd');
                      }}
                      placeholder={translate('write_name_to_search')}
                    />
                    {['اسم الشريك الأول', 'اسم الشريك الثاني', 'اسم الشريك الثالث'].map(
                      (item, index) => (
                        <Stack direction="row" justifyContent="space-between" key={index}>
                          <Typography
                            sx={{ fontWeight: 1000, fontSize: '15px', alignSelf: 'center' }}
                          >
                            {item}
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
                              handleSetId('13f85a9f-fd78-4d9d-9767-e8aa84164a28');
                            }}
                          >
                            {translate('booking_an_appointment')}
                          </Button>
                        </Stack>
                      )
                    )}
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}

export default StepOne;
import { BankImage } from '../../assets';
import { Stack, Paper, Typography, Button, Link } from '@mui/material';

/**
 * It is not completed yet, it needs some edits
 */
const styles = {
  paperContainer: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'inherit',
    backgroundImage: `url(${BankImage})`,
    width: '100%',
    height: '180px',
    padding: '10px',
  },
};
type Props = {
  enableButton?: boolean;
  bankName?: string;
  bankAccountName?: string;
  accountNumber?: string | number;
  imageUrl?: string;
};

const BankImageComp = ({
  enableButton,
  bankName,
  bankAccountName,
  accountNumber,
  imageUrl,
}: Props) => (
  <Stack direction="column" gap={1} sx={{ height: '270px' }} justifyContent="center">
    <Paper style={styles.paperContainer}>
      <Stack direction="column" sx={{ color: '#fff' }}>
        <Typography sx={{ fontSize: '10px', mb: '30px' }}>{bankName}</Typography>
        <Typography sx={{ fontSize: '15px', mb: '10px' }}>{bankAccountName}</Typography>
        <Typography sx={{ fontSize: '15px' }}>{accountNumber}</Typography>
      </Stack>
    </Paper>
    {enableButton && (
      <Button
        component={Link}
        href={imageUrl}
        download="صورة بطاقة الحساب البنكي"
        sx={{
          flex: 1,
          '&:hover': { backgroundColor: '#00000014' },
          backgroundColor: '#93A3B014',
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            padding: '8px',
            borderRadius: '10px',
          }}
          flex={1}
        >
          <Stack direction="row" gap={2}>
            <Stack direction="column" justifyContent="center">
              <img src={`/assets/icons/png-icon.svg`} alt="" />
            </Stack>
            <Stack direction="column">
              <Typography gutterBottom sx={{ fontSize: '13px' }}>
                صورة بطاقة الحساب البنكي
              </Typography>
              <Typography gutterBottom sx={{ fontSize: '13px' }}>
                126KB
              </Typography>
            </Stack>
          </Stack>
          <img src={`/assets/icons/download-icon.svg`} alt="" style={{ width: 25, height: 25 }} />
        </Stack>
      </Button>
    )}
  </Stack>
);

export default BankImageComp;

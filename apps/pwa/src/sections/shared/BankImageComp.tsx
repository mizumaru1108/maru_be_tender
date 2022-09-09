import { BankImage } from '../../assets';
import { Stack, Paper, Typography } from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';

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
};

const BankImageComp = ({ enableButton, bankName, bankAccountName, accountNumber }: Props) => (
  <Stack direction="column" gap={1} sx={{ height: '270px' }} justifyContent="center">
    <Paper style={styles.paperContainer}>
      <Stack direction="column" sx={{ color: '#fff' }}>
        <Typography gutterBottom variant="h5" sx={{ fontSize: 'sm' }}>
          {bankName}
        </Typography>
        <Typography gutterBottom variant="h5" sx={{ fontSize: '14' }}>
          {bankAccountName}
        </Typography>
        <Typography gutterBottom variant="h5" sx={{ fontSize: '14' }}>
          {accountNumber}
        </Typography>
      </Stack>
    </Paper>
    {enableButton && (
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          textAlign: { xs: 'center', md: 'left' },
          backgroundColor: '#93A3B014',
          padding: '8px',
          borderRadius: '10px',
        }}
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
    )}
  </Stack>
);

export default BankImageComp;

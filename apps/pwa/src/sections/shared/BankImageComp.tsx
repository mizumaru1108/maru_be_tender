import { BankImage } from '../../assets';
import { Box, Stack, Paper, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import ButtonDownloadFiles from '../../components/button/ButtonDownloadFiles';

/**
 * It is not completed yet, it needs some edits
 */
type Props = {
  enableButton?: boolean;
  bankName?: string;
  bankAccountName?: string;
  accountNumber?: string | number;
  imageUrl?: string;
  type?: string;
  size?: number;
  borderColor?: string;
  isPrint?: boolean;
};

const BankImageComp = ({
  enableButton,
  bankName,
  bankAccountName,
  accountNumber,
  imageUrl,
  size,
  type,
  borderColor,
  isPrint = false,
}: Props) => {
  const { translate } = useLocales();
  const cardImage = {
    size,
    type,
    url: imageUrl,
  };

  return (
    <Stack
      direction="column"
      gap={1}
      sx={{
        // height: isPrint ? '180px' : '270px',
        border: 0.5,
        borderRadius: 1,
        borderColor: `${borderColor}`,
      }}
      justifyContent="center"
      padding={0.5}
    >
      <Paper
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%',
          width: '100%',
          height: isPrint ? '140px' : '180px',
          padding: '10px',
          backgroundImage: `url(${BankImage})`,
          opacity: 1,
        }}
      >
        <Stack direction="column" sx={{ color: '#fff' }}>
          <Typography sx={{ fontSize: '10px', mb: '30px' }}>{bankName}</Typography>
          <Typography sx={{ fontSize: '15px', mb: '10px' }}>{bankAccountName}</Typography>
          <Typography sx={{ fontSize: '15px' }}>{accountNumber}</Typography>
        </Stack>
      </Paper>
      {!isPrint && enableButton && imageUrl && <ButtonDownloadFiles files={cardImage} />}
    </Stack>
  );
};

export default BankImageComp;

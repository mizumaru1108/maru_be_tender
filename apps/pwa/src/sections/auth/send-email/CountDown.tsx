import { Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { UitlsCountdownTimer } from 'utils/countdownTimer';

interface Props {
  time: number;
}

export default function CountdownTimer({ time }: Props) {
  const { currentLang } = useLocales();
  return (
    <>
      <Typography
        data-cy="countdown-timer"
        gutterBottom
        sx={{
          fontFamily: 'Cairo',
          color: 'text.secondary',
          fontSize: '16px',
          direction: currentLang.value === 'ar' ? 'rtl' : 'ltr',
        }}
      >
        {UitlsCountdownTimer(time)}
      </Typography>
    </>
  );
}

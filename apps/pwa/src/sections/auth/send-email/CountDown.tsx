import { Typography } from '@mui/material';
import React, { useState, useMemo } from 'react';
import { UitlsCountdownTimer } from 'utils/countdownTimer';

interface Props {
  time: number;
}

export default function CountdownTimer({ time }: Props) {
  return (
    <>
      <Typography
        data-cy="countdown-timer"
        gutterBottom
        sx={{ fontFamily: 'Cairo', color: 'text.secondary', fontSize: '16px', direction: 'rtl' }}
      >
        {UitlsCountdownTimer(time)}
      </Typography>
    </>
  );
}

import { Box } from '@mui/material';
import React from 'react';

interface Props {
  direction: 'horizontal' | 'vertical';
  size: 'small' | 'medium' | 'large';
}
export default function Space({ direction, size }: Props) {
  const boxProps = React.useMemo(() => {
    let boxProps = {
      height: '',
      width: '',
    };
    let tmpHeight = '0px';
    let tmpWidth = '0px';
    if (direction === 'vertical') {
      // tmpHeight = '4px';
      tmpHeight = '100%';
      if (size === 'small') {
        tmpWidth = '16px';
      } else if (size === 'medium') {
        tmpWidth = '32px';
      } else if (size === 'large') {
        tmpWidth = '48px';
      }
    } else {
      tmpWidth = '100%';
      // tmpHeight = '0';
      if (size === 'small') {
        tmpHeight = '16px';
      } else if (size === 'medium') {
        tmpHeight = '32px';
      } else if (size === 'large') {
        tmpHeight = '48px';
      }
    }
    boxProps.height = tmpHeight;
    boxProps.width = tmpWidth;
    return boxProps;
  }, [direction, size]);
  return (
    <React.Fragment>
      <Box data-cy="space-box" width={boxProps.width} height={boxProps.height} />
    </React.Fragment>
  );
}

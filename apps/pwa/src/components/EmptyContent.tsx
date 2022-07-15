// @mui
import { styled } from '@mui/material/styles';
import { Typography, Box, BoxProps, Button } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
//
import Image from './Image';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(8, 2),
}));

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  title: string;
  img?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export default function EmptyContent({ title, description, img, actionButton, ...other }: Props) {
  return (
    <RootStyle {...other}>
      <Image
        disabledEffect
        visibleByDefault
        alt="empty content"
        src={
          img ||
          'https://minimal-assets-api.vercel.app/assets/illustrations/illustration_empty_content.svg'
        }
        sx={{ height: 240, mb: 3 }}
      />

      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
      {actionButton && actionButton}

    </RootStyle>
  );
}

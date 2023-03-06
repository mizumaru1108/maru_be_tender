// @mui
import { styled } from '@mui/material/styles';
import { Typography, Box, BoxProps, useTheme } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
//
import Image from './Image';
import useLocales from 'hooks/useLocales';

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
  const { translate } = useLocales();
  const theme = useTheme();

  return (
    <RootStyle {...other}>
      <Image
        disabledEffect
        visibleByDefault
        alt="empty content"
        src={img || '/assets/illustrations/illustration_empty_content.svg'}
        sx={{ height: 240, mb: 3 }}
      />

      <Typography
        variant="h6"
        sx={{ color: theme.palette.grey[600], fontStyle: 'italic' }}
        gutterBottom
      >
        {translate('errors.empty_data')}
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

import { Button, Grid, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../../@types/commons';
import useAuth from '../../../../hooks/useAuth';

interface Props {
  title: string;
  backButton: boolean;
}

export default function HeaderWithBackButton({ title = 'no_title', backButton = true }: Props) {
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();

  return (
    <Grid item md={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {!backButton ? null : (
        <Grid item md={4}>
          <Button
            data-cy="back-button"
            color="inherit"
            variant="contained"
            onClick={() => navigate(`/${role_url_map[`${activeRole!}`]}/dashboard/system-messages`)}
            sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
          >
            <Iconify
              icon={
                currentLang.value === 'en'
                  ? 'eva:arrow-ios-back-outline'
                  : 'eva:arrow-ios-forward-outline'
              }
              width={25}
              height={25}
            />
          </Button>
        </Grid>
      )}
      <Grid item md={8}>
        <Typography
          data-cy="title-header-with-back-button"
          variant="h4"
          sx={{
            maxWidth: '700px',
          }}
        >
          {translate(title)}
        </Typography>
      </Grid>
    </Grid>
  );
}

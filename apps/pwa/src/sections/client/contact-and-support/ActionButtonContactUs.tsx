import { Button, Grid, Stack } from '@mui/material';
import useLocales from 'hooks/useLocales';
// import { ContactSupportProps } from './types';
// import { MainValuesProps, Props, RegisterValues } from '../register-shared/register-types';

// const EnumType: string = 'general_inquiry' | 'project_inquiry' | 'visit_inquiry';

interface Props {
  isLoading: boolean;
}

const ActionButtonContactUs = ({ isLoading }: Props) => {
  const { translate } = useLocales();
  return (
    <>
      <Grid item md={12} xs={12}>
        <Stack justifyContent="center" direction="row" gap={2}>
          <Button
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
            data-cy="button.cancel"
            disabled={isLoading}
          >
            {translate('button.cancel')}
          </Button>
          <Button
            type="submit"
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
            data-cy="button.confirm"
            disabled={isLoading}
          >
            {translate('button.confirm')}
          </Button>
        </Stack>
      </Grid>
    </>
  );
};

export default ActionButtonContactUs;

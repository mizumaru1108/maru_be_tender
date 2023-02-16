import { Box, Button, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
import Iconify from '../../../components/Iconify';

type Props = {
  // entity_name: string;
  // EditStatus: string;
};

function ProposalAmandementHeader() {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();

  return (
    <Stack
      spacing={4}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      component="div"
      sx={{ width: '100%' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 1, minWidth: 25, minHeight: 25, mr: 3 }}
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
        <Box>
          <Typography variant="h4">إرسال طلب تعديل للشريك</Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export default ProposalAmandementHeader;

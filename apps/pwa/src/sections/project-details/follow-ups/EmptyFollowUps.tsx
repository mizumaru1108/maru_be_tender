import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';
import useLocales from 'hooks/useLocales';

function EmptyFollowUps() {
  const { translate } = useLocales();

  return (
    <Container>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        p="20px"
        style={{ minHeight: '30vh' }}
      >
        <Box sx={{ width: '100%' }}>
          <Stack justifyItems="center" gap={1}>
            <Box sx={{ textAlign: 'center' }}>
              <SvgIconStyle src={`/icons/empty-project.svg`} />
            </Box>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {translate('content.client.main_page.empty_text_followup')}
            </Typography>
            <Typography sx={{ textAlign: 'center', color: '#93A3B0' }}>
              {translate('content.client.main_page.empty_add_comment_followup')}
            </Typography>
          </Stack>
        </Box>
      </Grid>
    </Container>
  );
}

export default EmptyFollowUps;

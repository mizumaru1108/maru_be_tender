import { Button, Link, Stack, Typography } from '@mui/material';

function FollowUpsFile({ created_at, file }: any) {
  return (
    <Stack
      direction="column"
      gap={2}
      sx={{
        width: '95%',
      }}
    >
      <Button
        component={Link}
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        download="صورة بطاقة الحساب البنكي"
        sx={{
          '&:hover': { backgroundColor: '#00000014' },
          backgroundColor: '#93A3B014',
          width: '100%',
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            padding: '8px',
            borderRadius: '10px',
          }}
          flex={1}
        >
          <Stack direction="row" gap={2}>
            <img src={`/assets/icons/doc-icon.svg`} alt="" style={{ width: '50px' }} />
            <Stack direction="column">
              <Typography gutterBottom sx={{ fontSize: '13px' }}>
                ملف خطاب طلب الدعم
              </Typography>
              <Typography gutterBottom sx={{ fontSize: '13px' }}>
                {`${file.size}KB`}
              </Typography>
            </Stack>
          </Stack>
          <img src={`/assets/icons/download-icon.svg`} alt="" style={{ width: 25, height: 25 }} />
        </Stack>
      </Button>
      <Typography sx={{ color: 'gray', alignSelf: 'end', fontSize: '10px' }}>{`${
        new Date().getDate() - new Date(created_at).getDate()
      } ساعات`}</Typography>
    </Stack>
  );
}

export default FollowUpsFile;

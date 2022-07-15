// @mui
import {
  Box,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';

import Iconify from 'components/Iconify';

import { TableMoreMenu } from 'components/table';

export default function BranchDetail() {
  return (
    <Box>
      <Typography variant="h6" marginBottom={2}>
        Assignment List
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        borderRadius="10px"
        bgcolor="grey.100"
      >
        {Array.from(Array(5)).map((x, key) => (
          <Box
            key={key}
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            padding="12px 16px"
            width="100%"
          >
            <Box display="flex" flexDirection="row" width="100%">
              <Avatar
                src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                sx={{ width: 48, height: 48 }}
              />
              <Box display="grid" justifyContent="center" flexDirection="column" marginLeft={2}>
                <Typography noWrap variant="subtitle2">
                  Esther Howard
                </Typography>
                <Typography noWrap variant="body2" color="text.secondary">
                  Bandung, Jawa Barat
                </Typography>
              </Box>
            </Box>
            <TableMoreMenu
              direction="horizontal"
              actions={
                <>
                  <MenuItem>
                    <Iconify icon={'majesticons:checkbox-list-detail'} />
                    Detail
                  </MenuItem>
                  <MenuItem>
                    <Iconify icon={'eva:edit-fill'} />
                    Edit
                  </MenuItem>
                  <MenuItem>
                    <Iconify icon={'eva:trash-2-outline'} />
                    Delete
                  </MenuItem>
                </>
              }
            />
          </Box>
        ))}
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box display="flex" flexDirection="column">
        {Array.from(Array(2)).map((x, key) => (
          <Box key={key} display="flex" flexDirection="column" sx={{ my: 2 }}>
            <Typography variant="overline" color="text.primary">
              HENDI IRAWAN
            </Typography>
            <Typography variant="caption" color="text.disabled">
              comment this 3 weeks ago
            </Typography>
          </Box>
        ))}
      </Box>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        color="inherit"
        sx={{ textTransform: 'none' }}
      >
        Add a comment
      </Button>
    </Box>
  );
}

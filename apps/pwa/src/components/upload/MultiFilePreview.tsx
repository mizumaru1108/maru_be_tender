import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import {
  List,
  IconButton,
  ListItemText,
  ListItem,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
import getFileData from '../../utils/getFileData';
// type
import { UploadMultiFileProps } from './type';
//
import Image from '../Image';
import Iconify from '../Iconify';
import { varFade } from '../animate';

// ----------------------------------------------------------------------

export default function MultiFilePreview({
  showPreview = false,
  files,
  onRemove,
  disabled,
}: // isCompressing,
UploadMultiFileProps) {
  const hasFile = (files && files.length > 0) ?? false;
  // console.log('isCompressing', isCompressing);
  return (
    <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
      <AnimatePresence>
        {files &&
          typeof files !== 'string' &&
          files.length > 0 &&
          // isCompressing &&
          files.map((file, index) => {
            const { key, name, size, preview, fileExtension, fullName, type } = getFileData(
              file,
              index
            );
            const extPrefix = fileExtension ? fileExtension?.split('/')[0] : type?.split('/')[0];
            // console.log('extPrefix', extPrefix, preview);
            if (extPrefix === 'aplication') {
              return (
                <ListItem
                  key={key}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    my: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: 0.75,
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  {/* <Box sx={{ my: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {fullName} - {size ? fData(size) : ''}
                    </Typography>
                  </Box> */}
                  {onRemove && (
                    <IconButton
                      size="small"
                      onClick={() => onRemove(file)}
                      sx={{
                        top: 6,
                        p: '2px',
                        right: 6,
                        position: 'absolute',
                        color: 'common.white',
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                        },
                      }}
                    >
                      <Iconify icon={'eva:close-fill'} />
                    </IconButton>
                  )}
                </ListItem>
              );
            }
            if (extPrefix === 'image') {
              return (
                <ListItem
                  key={key}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.25,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Image alt="preview" src={preview} ratio="1/1" />
                  {/* {isCompressing ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Image alt="preview" src={preview} ratio="1/1" />
                  )} */}

                  {!disabled && onRemove && (
                    <IconButton
                      size="small"
                      onClick={() => onRemove(file)}
                      sx={{
                        top: 6,
                        p: '2px',
                        right: 6,
                        position: 'absolute',
                        color: 'common.white',
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                        },
                      }}
                    >
                      <Iconify icon={'eva:close-fill'} />
                    </IconButton>
                  )}
                </ListItem>
              );
            }
            // if (showPreview) {

            // }

            return (
              <ListItem
                key={key}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Iconify
                  icon={'eva:file-fill'}
                  sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }}
                />

                <ListItemText
                  primary={typeof file === 'string' ? file : fullName}
                  secondary={typeof file === 'string' ? '' : fData(size || 0)}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />

                {/* {onRemove && (
                  <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                    <Iconify icon={'eva:close-fill'} />
                  </IconButton>
                )} */}
                {!disabled && onRemove && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 'auto',
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon={'eva:close-fill'} />
                  </IconButton>
                )}
              </ListItem>
            );
          })}
      </AnimatePresence>
    </List>
  );
}

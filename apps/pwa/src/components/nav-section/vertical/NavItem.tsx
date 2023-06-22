// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Tooltip, ListItemButtonProps } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
//
import Iconify from '../../Iconify';
//
import { NavItemProps } from '../type';
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from './style';
import React from 'react';

// ----------------------------------------------------------------------

type Props = NavItemProps & ListItemButtonProps;

export default function NavItem({ item, depth, active, open, isCollapse, count, ...other }: Props) {
  const { translate } = useLocales();
  const theme = useTheme();
  const { title, icon, info, children, disabled, caption } = item;
  // console.log({ count });
  const menuTitle = React.useMemo(() => {
    let tmpTitle = '';
    if (
      title === 'incoming_funding_requests_project_supervisor' ||
      title === 'incoming_funding_requests' ||
      title === 'incoming_exchange_permission_requests'
    ) {
      tmpTitle = count?.incoming
        ? `( ${count?.incoming || 0} ) ${translate(title)}`
        : translate(title);
    } else if (title === 'requests_in_process') {
      tmpTitle = count?.inprocess
        ? `( ${count?.inprocess || 0} ) ${translate(title)}`
        : translate(title);
    } else if (title === 'previous_funding_requests') {
      tmpTitle = count?.previous
        ? `( ${count?.previous || 0} ) ${translate(title)}`
        : translate(title);
    } else if (title === 'payment_adjustment' || title === 'exchange_permission') {
      tmpTitle = count?.payment_adjustment
        ? `( ${count?.payment_adjustment || 0} ) ${translate(title)}`
        : translate(title);
    } else if (title === 'pages.common.close_report.text.project_report') {
      tmpTitle = count?.close_report
        ? `( ${count?.close_report || 0} ) ${translate(title)}`
        : translate(title);
    } else {
      tmpTitle = translate(title);
    }
    return tmpTitle;
  }, [title, translate, count]);
  // console.log({ menuTitle });
  const renderContent = (
    <ListItemStyle depth={depth} active={active} disabled={disabled} {...other}>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}

      {depth !== 1 && <DotIcon active={active && depth !== 1} />}

      <ListItemTextStyle
        isCollapse={isCollapse}
        primary={menuTitle}
        secondary={
          caption && (
            <Tooltip title={translate(caption)} placement="top-start">
              <span>{translate(caption)}</span>
            </Tooltip>
          )
        }
        primaryTypographyProps={{
          noWrap: true,
          variant: active ? 'subtitle2' : 'body2',
          ...(active && { color: theme.palette.primary.contrastText }),
        }}
        secondaryTypographyProps={{
          noWrap: true,
          variant: 'caption',
          ...(active && { color: theme.palette.primary.contrastText }),
        }}
      />

      {!isCollapse && (
        <>
          {info && (
            <Box component="span" sx={{ lineHeight: 0 }}>
              {info}
            </Box>
          )}

          {!!children && (
            <Iconify
              icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
              sx={{ width: 16, height: 16, ml: 1, flexShrink: 0 }}
            />
          )}
        </>
      )}
    </ListItemStyle>
  );

  return <>{renderContent}</>;
}

// ----------------------------------------------------------------------

type DotIconProps = {
  active: boolean;
};

export function DotIcon({ active }: DotIconProps) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
            color: '#fff',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

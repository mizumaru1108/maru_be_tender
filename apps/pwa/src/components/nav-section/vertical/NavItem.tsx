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
import useAuth from 'hooks/useAuth';

// ----------------------------------------------------------------------

type Props = NavItemProps & ListItemButtonProps;

export default function NavItem({ item, depth, active, open, isCollapse, count, ...other }: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const theme = useTheme();
  const { title, icon, info, children, disabled, caption } = item;
  // console.log({ title, count });
  const menuTitle = React.useMemo(() => {
    let tmpTitle = '';
    if (
      title === 'incoming_funding_requests_project_supervisor' ||
      title === 'incoming_funding_requests'
    ) {
      tmpTitle = count?.incoming
        ? `( ${count?.incoming || 0} ) ${translate(title)}`
        : translate(title);
    } else if (title === 'requests_in_process') {
      tmpTitle = count?.inprocess
        ? `( ${count?.inprocess || 0} ) ${translate(title)}`
        : translate(title);
    }
    // else if (title === 'previous_funding_requests') {
    //   tmpTitle = count?.previous
    //     ? `( ${count?.previous || 0} ) ${translate(title)}`
    //     : translate(title);
    // }
    else if (
      title === 'payment_adjustment' ||
      title === 'exchange_permission' ||
      title === 'incoming_exchange_permission_requests'
    ) {
      tmpTitle = count?.payment_adjustment
        ? `( ${count?.payment_adjustment || 0} ) ${translate(title)}`
        : translate(title);
    } else if (title === 'pages.common.close_report.text.project_report') {
      const sumCloseReportSpv =
        Number(count?.close_report) +
        Number(count?.pending_closing_report) +
        Number(count?.complete_close_report);
      tmpTitle =
        sumCloseReportSpv > 0
          ? `( ${
              activeRole === 'tender_client'
                ? count?.close_report
                : activeRole === 'tender_project_manager' || activeRole === 'tender_ceo'
                ? count?.complete_close_report
                : sumCloseReportSpv
            } ) ${translate(title)}`
          : translate(title);
    } else {
      tmpTitle = translate(title);
    }
    return tmpTitle;
  }, [title, translate, count, activeRole]);
  // console.log({ menuTitle });
  const renderContent = (
    <ListItemStyle
      data-cy={`NavItem-${title}`}
      depth={depth}
      active={active}
      disabled={disabled}
      {...other}
    >
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

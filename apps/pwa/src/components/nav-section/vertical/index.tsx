// @mui
import { List, Box } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
//
import { NavSectionProps } from '../type';
import { ListSubheaderStyle } from './style';
import NavList from './NavList';
import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'redux/store';
import React from 'react';
import { getProposalCount } from 'redux/slices/proposal';
import { FEATURE_PROPOSAL_COUNTING } from 'config';

// ----------------------------------------------------------------------

export default function NavSectionVertical({ navConfig, isCollapse, ...other }: NavSectionProps) {
  const { translate } = useLocales();
  const { loadingCount, proposalCount } = useSelector((state) => state.proposal);
  const { user, activeRole } = useAuth();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (FEATURE_PROPOSAL_COUNTING) {
      dispatch(getProposalCount(activeRole ?? 'test'));
    }
  }, [dispatch, activeRole]);

  // console.log({ loadingCount, proposalCount });
  if (loadingCount) return <>{translate('pages.common.loading')}</>;
  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          {group.items.map((list: any) => (
            <NavList
              key={list.title + '-' + list.path}
              data={list}
              depth={1}
              hasChildren={!!list.children}
              isCollapse={isCollapse}
              count={FEATURE_PROPOSAL_COUNTING ? proposalCount : undefined}
            />
          ))}
        </List>
      ))}
    </Box>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { List, Collapse, Link } from '@mui/material';
//
import { NavListProps } from '../type';
import NavItem from './NavItem';
import { getActive, isExternalLink } from '..';
//redux
import { setActiveConversationId, setMessageGrouped } from 'redux/slices/wschat';
import { useDispatch } from 'redux/store';
import { ProposalCount } from '../../../@types/proposal';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  depth: number;
  hasChildren: boolean;
  isCollapse?: boolean;
  count?: ProposalCount;
};

export default function NavList({
  data,
  depth,
  hasChildren,
  isCollapse = false,
  count,
}: NavListRootProps) {
  // console.log({ count });
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const active = getActive(data.path, pathname);

  const [open, setOpen] = useState(active);

  const handleClickItem = () => {
    if (!hasChildren) {
      navigate(data.path);
    }
    setOpen(!open);

    dispatch(setActiveConversationId(null));
    dispatch(setMessageGrouped([]));
  };

  return (
    <>
      {isExternalLink(data.path) ? (
        <Link href={data.path} target="_blank" rel="noopener" underline="none">
          <NavItem
            sx={{
              color: '#000',
              fontFamily: 'Cairo',
              fontStyle: 'Regular',
              fontSize: '14px',
              ...(active && {
                color: '#fff',
              }),
            }}
            data-cy={`NavItem-${data.title}`}
            item={data}
            depth={depth}
            open={open}
            active={active}
            isCollapse={isCollapse}
            count={count}
          />
        </Link>
      ) : (
        <NavItem
          sx={{
            color: '#000',
            fontSize: '14px',
            ...(active && {
              color: '#fff',
            }),
          }}
          data-cy={`NavItem-${data.title}`}
          item={data}
          depth={depth}
          open={open}
          active={active}
          isCollapse={isCollapse}
          count={count}
          onClick={handleClickItem}
        />
      )}

      {!isCollapse && hasChildren && (
        <Collapse in={open} unmountOnExit>
          <List component="div" disablePadding>
            <NavSubList data={data.children} depth={depth} />
          </List>
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[];
  depth: number;
};

function NavSubList({ data, depth }: NavListSubProps) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChildren={!!list.children}
        />
      ))}
    </>
  );
}

import { Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
// urql + subscription
import { useSubscription } from 'urql';
import { getListConversations } from 'queries/messages/getListConversations';
// redux
import { setConversation } from 'redux/slices/wschat';
import { useDispatch } from 'redux/store';

import MessageContent from './content/MessageContent';
import MessageMenu from './menu/MessageMenu';

// config
import { HEADER } from '../../config';
import { Conversation } from '../../@types/wschat';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  width: '50%',
}));

const ContentStyleMessage = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  position: 'fixed',
  top: HEADER.MAIN_DESKTOP_HEIGHT + 10,
  right: theme.spacing(2),
  bottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  width: '40%',
  padding: theme.spacing(2),
  backgroundColor: '#fff',
}));

// ----------------------------------------------------------------------

function MessagesPage() {
  const { activeRole, user } = useAuth();
  const role = activeRole!;

  // urql + subscription
  const [resultConversation] = useSubscription({ query: getListConversations });
  const { data, fetching, error } = resultConversation;

  // redux messages
  const dispatch = useDispatch();

  useEffect(() => {
    if (!fetching && data) {
      const { room_chat } = data;
      const newArr = room_chat.map((el: Conversation) => ({
        ...el,
        participant1: {
          ...el.participant1,
          roles:
            el.messages[0].owner_id === el.participant1?.id
              ? el.messages[0].sender_role_as
              : el.messages[0].receiver_role_as,
        },
        participant2: {
          ...el.participant2,
          roles:
            el.messages[0].owner_id === el.participant2?.id
              ? el.messages[0].sender_role_as
              : el.messages[0].receiver_role_as,
        },
      }));

      dispatch(setConversation(newArr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fetching]);

  return (
    <Page title="Message Page">
      <Stack direction="row" spacing={1} component="div" justifyContent="space-between">
        <ContentStyle>
          <MessageMenu accountType={role} user={user} fetching={resultConversation.fetching} />
        </ContentStyle>
        <ContentStyleMessage>
          <MessageContent />
        </ContentStyleMessage>
      </Stack>
    </Page>
  );
}

export default MessagesPage;

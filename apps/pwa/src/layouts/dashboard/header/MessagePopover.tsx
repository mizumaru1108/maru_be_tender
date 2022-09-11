import { noCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  Stack,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import SvgIconStyle from 'components/SvgIconStyle';
import { sub } from 'date-fns';

// ----------------------------------------------------------------------
const _messages = [...Array(2)].map((_, index) => ({
  id: `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  data: [
    'تم ارسال طلب تعديل بينات الحساب البنكي الرجاء التاكد من صحة البيانات المدخلة',
    'تم ارسال طلب تعديل مخرجات المشروع النواتج الرجاء جعل اطار عمل المشروع و نتائجه اكبر ليناسب سياسة الشركة',
  ][index],
  createdAt: sub(new Date(), { days: index, hours: index }),
  isUnRead: [true, false][index],
  senderName: ['مشرف المشروع', 'مسؤول الفرز'][index],
}));

export default function MessagePopover() {
  const [messages, setMessages] = useState(_messages);

  const totalUnRead = messages.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setMessages(
      messages.map((message) => ({
        ...message,
        isUnRead: false,
      }))
    );
  };

  return (
    <>
      <IconButtonAnimate onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <SvgIconStyle
          src={`/assets/icons/dashboard-header/message-bar.svg`}
          sx={{ width: 25, height: 25, color: '#000' }}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 500, p: 0, mt: 1.5, ml: 0.75, backgroundColor: '#fff' }}
        disabledArrow={true}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">الرسائل</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              لديك {totalUnRead} رسائل غير مقروئة
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed', mb: '10px' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {messages.map((message, index) => (
              <NotificationItem key={index} message={message} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  data: string;
  createdAt: Date;
  isUnRead: boolean;
  senderName: string;
};

function NotificationItem({ message }: { message: NotificationItemProps }) {
  const { avatar, description } = renderContent(message);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(message.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={message.senderName}
        secondary={
          <Stack direction="column">
            <Typography>{description}</Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              {fToNow(message.createdAt)}
            </Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(message: NotificationItemProps) {
  const description = (
    <Typography variant="subtitle2">
      {message.data}
      {/* <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography> */}
    </Typography>
  );
  return {
    avatar: <img alt={message.data} src="/icons/sender-icon.svg" />,
    description,
  };
}

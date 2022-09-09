import {
  Grid,
  Typography,
  Stack,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import { TypedStartListening } from '@reduxjs/toolkit';

/**
 * @params Array of previous inqueries
 * @returns Crads[]:React NodeElements
 */

export type InquerieCardProps = {
  id: string;
  project_name: string;
  establishing_data1: string;
  project_state: string;
  project_details: string;
};

type Props = {
  data: InquerieCardProps;
};
function InquiryCard({ data }: Props) {
  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        <Typography
          variant="h6"
          color="text.tertiary"
          gutterBottom
          sx={{ fontSize: '15px !important' }}
        >
          {data.id}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '15px !important' }}>
          {data.project_name}
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" gap={1}>
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              تاريخ الإنشاء
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
              {data.establishing_data1}
            </Typography>
          </Stack>
          <Stack direction="column" gap={1}>
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              حالة المشروع
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
              {data.project_state}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
          تفاصيل المشروع
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="#1E1E1E">
          {data.project_details}
        </Typography>
        <Divider />
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: '30px' }}>
        <Stack direction="column">
          <Typography
            variant="h6"
            color="#93A3B0"
            gutterBottom
            sx={{ fontSize: '10px !important' }}
          >
            الإنشاء منذ
          </Typography>
          <Typography
            variant="h6"
            color="#1E1E1E"
            gutterBottom
            sx={{ fontSize: '15px !important' }}
          >
            5 ساعات
          </Typography>
        </Stack>
        <Button sx={{ background: '#0E8478', color: '#fff' }}>عرض التفاصيل</Button>
      </CardActions>
    </Card>
  );
}

export default InquiryCard;

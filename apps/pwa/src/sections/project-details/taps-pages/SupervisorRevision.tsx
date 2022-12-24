import { Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'redux/store';

function SupervisorRevision() {
  const { proposal } = useSelector((state) => state.proposal);
  // const [result] = useQuery({
  //   query: `query MyQuery($propsal_id: String = "") {
  //   consultant_form(where: {proposal_id: {_eq: $propsal_id}}) {
  //     added_value
  //     been_made_before
  //     been_supported_before
  //     chairman_of_board_of_directors
  //     id
  //     most_clents_projects
  //     reasons_to_accept
  //     clause
  //     recommended_support {
  //       amount
  //       clause
  //       consultant_form_id
  //       explanation
  //       id
  //     }
  //     remote_or_insite
  //     supervisor_id
  //     target_group_age
  //     target_group_num
  //     target_group_type
  //   }
  // }
  // `,
  //   variables: { propsal_id },
  // });

  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" gap={2}>
            <Typography variant="h6">القيمة المضافة</Typography>
            <Typography>{proposal.added_value}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">تم إنشاءه مسبقاً</Typography>
            <Typography>{proposal.been_made_before ? 'نعم' : 'لا'}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">تم دعمه مسبقاً</Typography>
            <Typography>{proposal.been_supported_before ? 'نعم' : 'لا'}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" gap={2}>
            <Typography variant="h6">رئيس مجلس الإدارة</Typography>
            <Typography>{proposal.chairman_of_board_of_directors}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">أبرز أعمال الجهة</Typography>
            <Typography>{proposal.most_clents_projects}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">مسوغات عمل المشروع</Typography>
            <Typography>{proposal.reasons_to_accept}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" gap={2}>
            <Typography variant="h6">عن بُعد أو حضوري؟</Typography>
            <Typography>{proposal.remote_or_insite ? 'عن بعد' : 'حضوري'}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">أعمار الفئة المستهدفة</Typography>
            <Typography>{proposal.target_group_age}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">عدد الفئة المستهدفة</Typography>
            <Typography>{proposal.target_group_num}</Typography>
          </Stack>
          <Stack direction="column" gap={2}>
            <Typography variant="h6">نوع الفئة المستهدفة</Typography>
            <Typography>{proposal.target_group_type}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item md={12} xs={12}>
        <Stack
          direction="row"
          justifyContent={'space-between'}
          gap={3}
          sx={{ backgroundColor: '#fff', padding: '10px' }}
        >
          <Typography variant="h6">البند</Typography>
          <Typography variant="h6">الشرح</Typography>
          <Typography variant="h6">المبلغ</Typography>
        </Stack>
      </Grid>
      {proposal.recommended_support &&
        proposal.recommended_support.map((item, index) => (
          <Grid item md={12} xs={12} key={index}>
            <Stack
              direction="row"
              justifyContent={'space-between'}
              gap={3}
              sx={{ padding: '10px' }}
            >
              <Typography>{item.clause}</Typography>
              <Typography>{item.explanation}</Typography>
              <Typography>{item.amount}</Typography>
            </Stack>
          </Grid>
        ))}
      <Grid item md={12} xs={12}>
        <Stack direction="column" gap={2}>
          <Typography>البند</Typography>
          <Typography>{proposal.clause}</Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default SupervisorRevision;

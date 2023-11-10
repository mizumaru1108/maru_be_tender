import { Grid, Box, Typography, Stack } from '@mui/material';
import { useSelector } from 'redux/store';
import useLocales from '../../../hooks/useLocales';
import { fCurrencyNumber } from 'utils/formatNumber';

const target_age_map = {
  AGE_1TH_TO_13TH: 'AGE_1TH_TO_13TH',
  AGE_14TH_TO_30TH: 'AGE_14TH_TO_30TH',
  AGE_31TH_TO_50TH: 'AGE_31TH_TO_50TH',
  AGE_51TH_TO_60TH: 'AGE_51TH_TO_60TH',
  AGE_OVER_60TH: 'AGE_OVER_60TH',
  ALL_AGE: 'ALL_AGE',
};

const target_type_map = {
  YOUTHS: 'YOUTHS',
  GIRLS: 'GIRLS',
  CHILDREN: 'CHILDREN',
  FAMILY: 'FAMILY',
  PARENTS: 'PARENTS',
  MOMS: 'MOMS',
  EMPLOYEMENT: 'EMPLOYEMENT',
  PUBLIC_BENEFIT: 'PUBLIC_BENEFIT',
  CHARITABLE_ORGANIZATIONS: 'CHARITABLE_ORGANIZATIONS',
  CHARITABLE_WORKERS: 'CHARITABLE_WORKERS',
};
function SupervisorRevision() {
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);

  return (
    <Grid container spacing={3} sx={{ pb: 8 }}>
      <Grid item md={3} xs={12}>
        <Stack component="div" spacing={3} direction="column">
          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              القيمة المضافة
            </Typography>
            <Typography>{proposal.added_value}</Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              تم إنشاءه مسبقاً
            </Typography>
            <Typography>{proposal.been_made_before ? 'نعم' : 'لا'}</Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              تم دعمه مسبقاً
            </Typography>
            <Typography>{proposal.been_supported_before ? 'نعم' : 'لا'}</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item md={3} xs={12}>
        <Stack component="div" spacing={3} direction="column">
          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              رئيس مجلس الإدارة
            </Typography>
            <Typography>{proposal.chairman_of_board_of_directors ?? '-No data-'}</Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              أبرز أعمال الجهة
            </Typography>
            <Typography>{proposal.most_clents_projects ?? '-No data-'}</Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              مسوغات عمل المشروع
            </Typography>
            <Typography>{proposal.reasons_to_accept ?? '-No data-'}</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item md={3} xs={12}>
        <Stack component="div" spacing={3} direction="column">
          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              عن بُعد أو حضوري؟
            </Typography>
            <Typography>
              {proposal?.remote_or_insite
                ? translate(`remote_or_insite.${proposal.remote_or_insite}`)
                : '-No data-'}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              أعمار الفئة المستهدفة
            </Typography>
            {/* <Typography>{proposal.target_group_age}</Typography> */}
            <Typography>
              {(Object.entries(target_age_map).find(
                ([key, value]) => value === proposal.target_group_age
              )?.[0] &&
                translate(
                  `review.target_group_age_enum.${
                    Object.entries(target_age_map).find(
                      ([key, value]) => value === proposal.target_group_age
                    )?.[0]
                  }`
                )) ||
                proposal.target_group_age}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              عدد الفئة المستهدفة
            </Typography>
            <Typography>{proposal.target_group_num}</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item md={3} xs={12}>
        <Stack component="div" spacing={3} direction="column">
          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              نوع الفئة المستهدفة
            </Typography>
            {/* <Typography>{proposal.target_group_type}</Typography> */}
            <Typography>
              {(Object.entries(target_type_map).find(
                ([key, value]) => value === proposal.target_group_type
              )?.[0] &&
                translate(
                  `review.target_group_type_enum.${
                    Object.entries(target_type_map).find(
                      ([key, value]) => value === proposal.target_group_type
                    )?.[0]
                  }`
                )) ||
                proposal.target_group_type}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>البند</Typography>
            <Typography>{proposal.clause || '-'}</Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item md={12} xs={12}>
        <Stack
          direction="row"
          justifyContent={'space-between'}
          gap={3}
          sx={{ backgroundColor: '#fff', padding: 1.5, borderRadius: 1, my: 1 }}
        >
          <Typography variant="h6">البند</Typography>
          <Typography variant="h6">الشرح</Typography>
          <Typography variant="h6">المبلغ</Typography>
        </Stack>

        {proposal.recommended_supports ? (
          proposal.recommended_supports.length ? (
            proposal.recommended_supports.map((item, index) => (
              <Stack
                direction="row"
                justifyContent={'space-between'}
                gap={3}
                sx={{ padding: '10px' }}
                key={index}
              >
                <Typography>{item.clause}</Typography>
                <Typography>{item.explanation}</Typography>
                <Typography>{fCurrencyNumber(item.amount)}</Typography>
              </Stack>
            ))
          ) : (
            <Typography
              flex={2}
              variant="body2"
              sx={{ color: '#1E1E1E', mt: 2, fontStyle: 'italic' }}
            >
              {translate('content.client.main_page.no_recommended_budgets_projects')}
            </Typography>
          )
        ) : null}
      </Grid>
    </Grid>
  );
}

export default SupervisorRevision;

import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { useSelector } from 'redux/store';
import { ItemBudget } from '../../../@types/proposal';
import React, { useEffect, useState } from 'react';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import useLocales from 'hooks/useLocales';

function ProjectBudget() {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate } = useLocales();

  const [itemBudgetsValue, setItemBudgetValue] = useState<ItemBudget[] | []>([]);
  const [summaryAmount, setSummaryAmount] = useState<number>(0);

  useEffect(() => {
    const projectTrack = proposal.project_track;
    let valueToItem: ItemBudget[], valueSummary: number;

    const totalAmount = proposal.proposal_item_budgets.reduce(
      (acc, cur) => acc + Number(cur.amount),
      0
    );

    valueToItem = proposal.proposal_item_budgets;
    // .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    valueToItem = [...valueToItem].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    // console.log({ valueToItem });
    // valueSummary = proposal.proposal_item_budgets_aggregate.aggregate.sum.amount;
    valueSummary = totalAmount;

    setItemBudgetValue(valueToItem);
    setSummaryAmount(valueSummary);

    // if (projectTrack === 'CONCESSIONAL_GRANTS') {
    //   valueToItem = proposal.recommended_supports;
    //   valueSummary = valueToItem.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    //   setItemBudgetValue(valueToItem);
    //   setSummaryAmount(valueSummary);
    // } else {
    //   valueToItem = proposal.proposal_item_budgets;
    //   valueSummary = proposal.proposal_item_budgets_aggregate.aggregate.sum.amount;

    //   setItemBudgetValue(valueToItem);
    //   setSummaryAmount(valueSummary);
    // }
  }, [proposal]);

  return (
    <Container>
      <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
        {translate('support_type')}
      </Typography>
      <Typography sx={{ mb: '20px' }}>
        {!proposal.support_type ? translate('full_support') : translate('partial_support')}
      </Typography>
      <Box
        sx={{
          mt: '20px',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'start',
          direction: 'row',
          gap: 3,
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        <Typography variant="h6" flex={2}>
          البند
        </Typography>
        <Typography variant="h6" flex={3}>
          الشرح
        </Typography>
        <Typography variant="h6" flex={2}>
          المبلغ
        </Typography>
      </Box>
      {itemBudgetsValue.length ? (
        itemBudgetsValue.map((item, index) => (
          <React.Fragment key={index}>
            <Stack direction="row" key={index} gap={3} sx={{ padding: '10px' }}>
              <Typography flex={2} sx={{ color: '#1E1E1E' }}>
                {item.clause}
              </Typography>
              <Typography flex={3} sx={{ color: '#1E1E1E' }}>
                {item.explanation}
              </Typography>
              <Typography flex={2} sx={{ color: '#1E1E1E' }}>
                {fCurrencyNumber(item.amount)}
              </Typography>
            </Stack>
            <Divider />
          </React.Fragment>
        ))
      ) : (
        <Typography
          flex={2}
          variant="body2"
          sx={{ color: '#1E1E1E', mt: 2, ml: 1, fontStyle: 'italic' }}
        >
          {translate('content.client.main_page.no_budgets_projects')}
        </Typography>
      )}
      <Box
        sx={{
          mt: '20px',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'start',
          direction: 'row',
          gap: 3,
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        <Box flex={2} />
        <Box flex={2} />
        <Typography variant="h6" flex={2.8}>
          {`المبلغ الإجمالي : ${fCurrencyNumber(summaryAmount)}`}
        </Typography>
      </Box>
    </Container>
  );
}

export default ProjectBudget;

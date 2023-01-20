import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import { Proposal } from '../../../@types/proposal';
import { useSelector } from 'redux/store';
import React from 'react';

function ProjectBudget() {
  const { proposal } = useSelector((state) => state.proposal);

  return (
    <Container>
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
      {proposal.proposal_item_budgets.map((item, index) => (
        <React.Fragment key={index}>
          <Stack direction="row" key={index} gap={3} sx={{ padding: '10px' }}>
            <Typography flex={2} sx={{ color: '#1E1E1E' }}>
              {item.clause}
            </Typography>
            <Typography flex={3} sx={{ color: '#1E1E1E' }}>
              {item.explanation}
            </Typography>
            <Typography flex={2} sx={{ color: '#1E1E1E' }}>
              {item.amount}
            </Typography>
          </Stack>
          <Divider />
        </React.Fragment>
      ))}
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
          {`المبلغ الإجمالي : ${
            (proposal as Proposal).proposal_item_budgets_aggregate.aggregate.sum.amount
          } ريال`}
        </Typography>
      </Box>
    </Container>
  );
}

export default ProjectBudget;

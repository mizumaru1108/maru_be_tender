import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import { gettingPaymentAdjustment } from 'queries/project-supervisor/gettingPaymentAdjustment';
import { useQuery } from 'urql';

function PaymentAdjustment() {
  const [result, reexecuteQuery] = useQuery({
    query: gettingPaymentAdjustment,
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.proposal ?? [];
  if (!props) return <></>;
  return (
    <Box sx={{ mt: '20px' }}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات إذن الصرف الواردة
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.project_name,
                sentSection: 'Supervisor',
                employee: 'Supervisor',
              }}
              footer={{ createdAt: new Date(item.createdAt), payments: item.payments }}
              cardFooterButtonAction="completing-exchange-permission"
              destination="payment-adjustment"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PaymentAdjustment;

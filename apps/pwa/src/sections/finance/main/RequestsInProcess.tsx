import { Typography, Grid } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import useAuth from 'hooks/useAuth';
import { gettingAllMyProposals } from 'queries/finance/gettingAllMyProposals';
import { gettingPaymentAdjustment } from 'queries/project-supervisor/gettingPaymentAdjustment';
import { useQuery } from 'urql';

const data = [
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'مسار المساجد',
      employee: 'اسم الموظف - مدير المشروع',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
      payments: [
        { name: 'الدفعة الأولى', status: true },
        { name: 'الدفعة الثانية', status: true },
        { name: 'الدفعة الثالثة', status: true },
        { name: 'الدفعة الرابعة', status: false },
        { name: 'الدفعة الخامسة', status: false },
        { name: 'الدفعة السادسة', status: false },
        { name: 'الدفعة السابعة', status: false },
      ],
    },
  },
] as ProjectCardProps[];

function RequestsInProcess() {
  const { user } = useAuth();
  const [result, reexecuteQuery] = useQuery({
    query: gettingAllMyProposals,
    variables: { finance_id: user?.id },
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.proposal ?? [];
  if (!props || props.length === 0) return <></>;
  return (
    <>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات قيد الإجراء
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{ id: item.id }}
              content={{
                projectName: item.project_name,
                organizationName: item.project_name,
                sentSection: 'Finance',
                employee: 'Finance',
              }}
              footer={{ createdAt: new Date(item.createdAt), payments: item.payments }}
              cardFooterButtonAction="completing-exchange-permission"
              destination="requests-in-process"
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default RequestsInProcess;

import { Typography, Grid } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import { useQuery } from 'urql';
import { incomingRequest } from '../../../queries/Cashier/supportRequest';

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
  const [result, reexecuteQuery] = useQuery({
    query: incomingRequest,
  });
  const { data, fetching, error } = result;
  if (fetching) {
    return <>...Loading</>;
  }
  const props = data?.proposal ?? [];
  console.log('props :', props);
  if (props.length === 0) return <></>;
  return (
    <>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        طلبات قيد الإجراء
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {props &&
          props.map((item: any, index: any) => (
            <Grid item md={6} key={index}>
              <ProjectCard
                // {...item}
                title={{ id: item.id }}
                content={{
                  projectName: item.project_name,
                  organizationName: item.project_idea,
                  sentSection: 'Cahsier',
                  employee: 'Cahsier',
                }}
                footer={{
                  createdAt: item.created_at,
                  payments: [
                    { name: 'الدفعة الأولى', status: true },
                    { name: 'الدفعة الثانية', status: true },
                    { name: 'الدفعة الثالثة', status: true },
                    { name: 'الدفعة الرابعة', status: false },
                    { name: 'الدفعة الخامسة', status: false },
                    { name: 'الدفعة السادسة', status: false },
                    { name: 'الدفعة السابعة', status: false },
                  ],
                }}
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

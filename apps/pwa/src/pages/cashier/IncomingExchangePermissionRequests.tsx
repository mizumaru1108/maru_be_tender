import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { CardTable } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import useLocales from '../../hooks/useLocales';

const data = [
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
      sentSection: 'cahsier',
      employee: 'اسم الموظف - مدير الإدارة',
      createdAtClient: new Date(2022, 8, 2, 15, 58),
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

function IncomingExchangePermissionRequests() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    // <Page title="Previous Funding Requests">
    <Page title={translate('pages.cashier.previous_funding_request')}>
      <Container>
        <ContentStyle>
          <CardTable
            data={data} // For testing, later on we will send the query to it
            title="طلبات إذن الصرف الواردة"
            cardFooterButtonAction="completing-exchange-permission"
            alphabeticalOrder={true}
            filters={[
              { name: 'اسم الجهة المشرفة*', options: [{ label: 'اسم الجهة المشرفة*', value: '' }] },
            ]}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingExchangePermissionRequests;

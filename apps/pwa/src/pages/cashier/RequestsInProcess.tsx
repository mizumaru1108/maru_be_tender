import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { CardTable } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';
import useLocales from '../../hooks/useLocales';
import { getProposals } from 'queries/commons/getProposal';
import CardTableBE from 'components/card-table/CardTableBE';
import useAuth from 'hooks/useAuth';

// const data = [
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
//   {
//     title: {
//       id: '768873',
//     },
//     content: {
//       projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
//       organizationName: 'جمعية الدعوة الصناعية الجديدة بالرياض',
//       sentSection: 'cahsier',
//       employee: 'اسم الموظف - مدير الإدارة',
//       createdAtClient: new Date(2022, 8, 2, 15, 58),
//     },
//     footer: {
//       createdAt: new Date(2022, 8, 2, 15, 58),
//       payments: [
//         { name: 'الدفعة الأولى', status: true },
//         { name: 'الدفعة الثانية', status: true },
//         { name: 'الدفعة الثالثة', status: true },
//         { name: 'الدفعة الرابعة', status: false },
//         { name: 'الدفعة الخامسة', status: false },
//         { name: 'الدفعة السادسة', status: false },
//         { name: 'الدفعة السابعة', status: false },
//       ],
//     },
//   },
// ] as ProjectCardProps[];

function RequestsInProcess() {
  const { user } = useAuth();
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
    // <Page title="Requests In Process">
    <Page title={translate('pages.cashier.requests_in_process')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={getProposals}
            title="طلبات إذن الصرف الواردة"
            destination="requests-in-process"
            alphabeticalOrder={true}
            filters={[
              {
                name: 'entity',
                title: 'اسم الجهة المشرفة',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'اسم المستخدم الأول', value: 'Essam Kayal' },
                  { label: 'اسم المستخدم الثاني', value: 'hisham' },
                  { label: 'اسم المستخدم الثالت', value: 'danang' },
                  { label: 'اسم المستخدم الرابع', value: 'yamen' },
                  { label: 'اسم المستخدم الخامس', value: 'hamdi' },
                ],
                generate_filter: (value: string) => ({
                  user: { client_data: { entity: { _eq: value } } },
                }),
              },
            ]}
            baseFilters={{
              inner_status: { inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' } },
              cashier_id: { cashier_id: { _eq: user?.id } },
            }}
            cardFooterButtonAction="completing-exchange-permission"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;

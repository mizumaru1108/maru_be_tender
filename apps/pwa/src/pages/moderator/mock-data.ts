import { ProjectCardProps } from 'components/card-table/types';

type footerMessage = {
  createdAt: Date;
};

export const CardTableIncomingSupportRequests = [
  {
    title: {
      id: '768873',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768874',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768875',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768876',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
] as ProjectCardProps[];

export const CardTablePreviousSupportRequests = [
  {
    title: {
      id: '768873',
      inquiryStatus: 'canceled',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768874',
      inquiryStatus: 'pending',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768875',
      inquiryStatus: 'completed',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
  {
    title: {
      id: '768876',
      inquiryStatus: 'canceled',
    },
    content: {
      projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
      employee: 'لا يوجد',
      sentSection: 'لا يوجد',
    },
    footer: {
      createdAt: new Date(2022, 8, 2, 15, 58),
    },
  },
] as ProjectCardProps[];

export const dataAccount = {
  accepted: {
    label: 'Active partner',
    value: 14,
  },
  processing: {
    label: 'Partner need to active',
    value: 40,
  },
  rejected: {
    label: 'Rejected partner',
    value: 20,
  },
  pending: {
    label: 'Pending partner',
    value: 25,
  },
};

export const dataProject = {
  accepted: {
    label: 'Successfully done',
    value: 40,
  },
  processing: {
    label: 'Processing',
    value: 14,
  },
  rejected: {
    label: 'Rejected',
    value: 20,
  },
  pending: {
    label: 'Spoon',
    value: 25,
  },
};

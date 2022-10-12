import useLocales from '../../hooks/useLocales';
import { IFilterMessage } from './type';

export const MessagesInternalCorespondence = [
  {
    partnerName: 'project1',
    projectName: 'name1',
    message:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem sequi, blanditiis provident assumenda ipsam officia ipsa repellendus quia quaerat reprehenderit inventore totam, necessitatibus ipsum ullam amet atque rerumiure saepe.',
    footer: new Date(2022, 8, 2, 15, 58),
  },
  {
    partnerName: 'project2',
    projectName: 'name2',
    message:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem sequi, blanditiis provident assumenda ipsam officia ipsa repellendus quia quaerat reprehenderit inventore totam, necessitatibus ipsum ullam amet atque rerumiure saepe.',
    footer: new Date(2022, 8, 2, 15, 58),
  },
];
export const MessagesExternalCorespondence = [
  {
    partnerName: 'project3',
    projectName: 'name3',
    message:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem sequi, blanditiis provident assumenda ipsam officia ipsa repellendus quia quaerat reprehenderit inventore totam, necessitatibus ipsum ullam amet atque rerumiure saepe.',
    footer: new Date(2022, 8, 2, 15, 58),
  },
  {
    partnerName: 'project4',
    projectName: 'name4',
    message:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem sequi, blanditiis provident assumenda ipsam officia ipsa repellendus quia quaerat reprehenderit inventore totam, necessitatibus ipsum ullam amet atque rerumiure saepe.',
    footer: new Date(2022, 8, 2, 15, 58),
  },
];

export const Message = [
  {
    sender: 'partner1',
    dateCreated: String(new Date(2022, 8, 2, 15, 58)),
    messageBody: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    timeCreated: new Date().getHours() + ':' + new Date().getMinutes(),
  },
  {
    sender: 'moderator',
    dateCreated: String(new Date(2022, 8, 2, 15, 58)),
    messageBody: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ...',
    timeCreated: new Date().getHours() + ':' + new Date().getMinutes(),
  },
];

export const TRACKS = ['Mosques Department', 'Facilitated Scholarship Track', 'Initiatives Track'];

export const EMPLOYEES = [
  { value: '123123', label: 'Mohamed', Role: 'Admin' },
  { value: '123124', label: 'Ahmed ', Role: 'CEO' },
  { value: '123125', label: 'Ali', Role: 'Moderator' },
  { value: '123125', label: 'Icha', Role: 'Supervisor' },
  { value: '123127', label: 'Ucok', Role: 'Admin' },
  { value: '123128', label: 'Chandra ', Role: 'CEO' },
  { value: '123129', label: 'Azam', Role: 'Moderator' },
  { value: '123110', label: 'Zaza', Role: 'Supervisor' },
];
export const EMPLOYEES1 = [
  { value: '123123', label: 'Mohamed', Role: 'Admin' },
  { value: '123124', label: 'Ahmed ', Role: 'CEO' },
  { value: '123125', label: 'Ali', Role: 'Moderator' },
];

export const EMPLOYEES2 = [
  { value: '123123', label: 'Mohamed', Role: 'Admin' },
  { value: '123124', label: 'Ahmed ', Role: 'CEO' },
  { value: '123125', label: 'Ali', Role: 'Moderator' },
  { value: '123125', label: 'Icha', Role: 'Supervisor' },
  { value: '123127', label: 'Ucok', Role: 'Admin' },
];

export const filterSupervisor: IFilterMessage[] = [
  {
    name: 'Supervising Authority  Name',
    options: [
      { value: '123123', label: 'Mohamed', Role: 'Admin' },
      { value: '123124', label: 'Ahmed ', Role: 'CEO' },
      { value: '123125', label: 'Ali', Role: 'Moderator' },
      { value: '123125', label: 'Icha', Role: 'Supervisor' },
      { value: '123127', label: 'Ucok', Role: 'Admin' },
      { value: '123128', label: 'Chandra ', Role: 'CEO' },
      { value: '123129', label: 'Azam', Role: 'Moderator' },
      { value: '123110', label: 'Zaza', Role: 'Supervisor' },
    ],
  },
  {
    name: 'Supervising Authority Name',
    options: [
      { label: 'Mosques Department', value: '123123' },
      { label: 'Facilitated Scholarship Track', value: '123124' },
      { label: 'Initiatives Track', value: '123125' },
    ],
  },
];

// export const filterProjectTrack: IFilterMessage = {
//   name: 'Supervising Authority  Name',
//   options: [
//     { label: 'Mosques Department', value: '123123' },
//     { label: 'Facilitated Scholarship Track', value: '123124' },
//     { label: 'Initiatives Track', value: '123125' },
//   ],
// };

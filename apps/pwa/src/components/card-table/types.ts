type CardFooter = {
  createdAt: Date;
  payments?: { status: boolean; name: string }[];
};

type CardTitle = {
  id: string;
  inquiryStatus?: 'canceled' | 'completed' | 'pending';
};

type CardContentComp = {
  projectName: string;
  organizationName?: string;
  createdAt?: Date;
  projectStatus?: string;
  sentSection?: string;
  employee?: string;
  projectDetails?: string;
};
export type ProjectCardProps = {
  title: CardTitle;
  content: CardContentComp;
  footer: CardFooter;
  cardFooterButtonAction:
    | 'show-project' // Without the action bar at the end of the page.
    | 'show-details' // With the action bar at the end if the page.
    | 'completing-exchange-permission' // With the action bar at the end if the page.
    | 'draft'; // Without the action bar at the end of the page, but with the ability to continue or remove the project.
  destination?:
    | 'previous-funding-requests'
    | 'incoming-funding-requests'
    | 'requests-in-process'
    | 'incoming-exchange-permission-requests'
    | 'current-project'
    | 'payment-adjustment'
    | 'exchange-permission'; // it refers to the url that I came from and the url that I have to go to
};

export type filterInterface = {
  name: string;
  options: { label: string; value: string }[];
};

export type CardTableProps = {
  title: string;
  limitShowCard?: number;
  data: ProjectCardProps[];
  dateFilter?: boolean;
  alphabeticalOrder?: boolean;
  pagination?: boolean;
  filters?: filterInterface[];
  taps?: string[];
  cardFooterButtonAction:
    | 'show-project' // Without the action bar at the end of the page.
    | 'show-details' // With the action bar at the end if the page.
    | 'completing-exchange-permission' // With the action bar at the end if the page.
    | 'draft'; // Without the action bar at the end of the page, but with the ability to continue or remove the project.
};

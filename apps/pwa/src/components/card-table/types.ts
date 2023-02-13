type CardFooter = {
  createdAt: Date;
  payments?: any;
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
  createdAtClient?: Date;
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

export type ProjectCardPropsBE = {
  id: string;
  inquiryStatus?: 'canceled' | 'completed' | 'pending';
  project_name?: string;
  created_at: Date;
  project_idea?: string;
  user: {
    employee_name: string;
    client_data: {
      entity: string;
      created_at: Date;
    };
  };
  proposal_logs: [
    {
      reviewer: {
        employee_name: string;
      };
      state: string;
    }
  ];
  state?: string;
  payments?: any;
  outter_status?: 'CANCELED' | 'COMPLETED' | 'PENDING';
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
  mutate: () => void;
};

export type CardTablePropsBE = {
  title: string;
  resource?: any;
  limitShowCard?: number;
  taps?: {
    key: string;
    options: Array<{
      label: string;
      value: any;
    }>;
  };
  dateFilter?: boolean;
  alphabeticalOrder?: boolean;
  pagination?: boolean;
  filters?: filterInterfaceBE[];
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
  staticFilters?: any;
  baseFilters?: any;
};

interface GenerateFilterReturning {
  [key: string]: string | GenerateFilterReturning;
}
export type filterInterface = {
  name: string;
  options: { label: string; value: string }[];
};

export type filterInterfaceBE = {
  name: string;
  title: string;
  options: { label: string; value: string }[];
  generate_filter: (value: string) => GenerateFilterReturning;
};

export type CardTableBEProps = {
  resource?: any;
  title: string;
  limitShowCard?: number;
  data: ProjectCardProps[];
  dateFilter?: boolean;
  alphabeticalOrder?: boolean;
  pagination?: boolean;
  filters?: filterInterfaceBE[];
  taps?: string[];
  cardFooterButtonAction:
    | 'show-project' // Without the action bar at the end of the page.
    | 'show-details' // With the action bar at the end if the page.
    | 'completing-exchange-permission' // With the action bar at the end if the page.
    | 'draft'; // Without the action bar at the end of the page, but with the ability to continue or remove the project.
};

export type CardTableProps = {
  resource?: any;
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
export type CardTableSearchingProps = {
  title: string;
  limitShowCard?: number;
  data: ProjectCardProps[];
  pagination?: boolean;
  cardFooterButtonAction:
    | 'show-project' // Without the action bar at the end of the page.
    | 'show-details' // With the action bar at the end if the page.
    | 'completing-exchange-permission' // With the action bar at the end if the page.
    | 'draft'; // Without the action bar at the end of the page, but with the ability to continue or remove the project.
};

export type SearchingProposal = {
  project: string;
  theYear: string;
  detailReport: string;
  geoRange: string;
  theField: string;
};

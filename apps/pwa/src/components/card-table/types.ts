type CardFooter = {
  createdAt: Date;
  payments?: any;
};

export type EnumInquiryStatus =
  | 'canceled'
  | 'completed'
  | 'pending'
  | 'pending_canceled'
  | 'on_revision'
  | 'ongoing'
  | 'asked_for_amandement';

type CardTitle = {
  id: string;
  inquiryStatus?: EnumInquiryStatus;
  project_number?: string;
};

type CardStatus = {
  id?: string;
  statusId?:
    | 'WAITING_FOR_ACTIVATION'
    | 'SUSPENDED_ACCOUNT'
    | 'CANCELED_ACCOUNT'
    | 'ACTIVE_ACCOUNT'
    | 'REVISED_ACCOUNT'
    | 'WAITING_FOR_EDITING_APPROVAL';
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
  entity_name?: string;
};
export type ProjectCardProps = {
  title: CardTitle;
  content: CardContentComp;
  footer: CardFooter;
  cardFooterButtonAction:
    | 'show-project' // Without the action bar at the end of the page.
    | 'show-details' // With the action bar at the end if the page.
    | 'completing-exchange-permission' // With the action bar at the end if the page.
    | 'draft' // Without the action bar at the end of the page, but with the ability to continue or remove the project.
    | 'reject-project';
  destination?:
    | 'previous-funding-requests'
    | 'incoming-funding-requests'
    | 'requests-in-process'
    | 'incoming-exchange-permission-requests'
    | 'current-project'
    | 'payment-adjustment'
    | 'exchange-permission' // it refers to the url that I came from and the url that I have to go to
    | 'project-report'
    | 'incoming-amandment-requests';
};

export type ClientCardProps = {
  title: CardStatus;
  createdAt: Date;
  email?: string;
  employeeName?: string;
  entityName?: string;
  id?: string;
  statusId?: string;
  updatedAt?: Date;
  footer?: CardFooter;
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
    | 'exchange-permission' // it refers to the url that I came from and the url that I have to go to
    | 'project-report';
};

export type ProjectCardPropsBE = {
  id: string;
  inquiryStatus?: 'canceled' | 'completed' | 'pending';
  project_name?: string;
  project_number?: number;
  updated_at: Date;
  created_at: Date;
  project_idea?: string;
  user: {
    id: string;
    employee_name: string;
    client_data: {
      entity: string;
    };
  };
  proposal_logs: [
    {
      reviewer: {
        employee_name: string;
      };
      created_at: Date;
      state: string;
    }
  ];
  state?: string;
  payments?: any;
  track_id?: string;
  support_outputs?: string;
  supervisor_id?: string;
  project_manager_id?: string;
  finance_id?: string;
  cashier_id?: string;
  outter_status?:
    | 'CANCELED'
    | 'COMPLETED'
    | 'PENDING'
    | 'PENDING_CANCELED'
    | 'ON_REVISION'
    | 'ASKED_FOR_AMANDEMENT'
    | 'ONGOING';
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
    | 'exchange-permission'
    | 'project-report'; // it refers to the url'' that I came from and the url that I have to go to
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
    | 'exchange-permission' // it refers to the url that I came from and the url that I have to go to
    | 'project-report';
  staticFilters?: any;
  baseFilters?: any;
};

type sorting =
  | 'range_date'
  | 'track'
  | 'sorting'
  | 'project_status'
  | 'project_name'
  | 'client_name';

export type CardTablePropsByBE<T = Record<string, any>> = {
  title: string;
  limitShowCard?: number;
  endPoint?: string;
  typeRequest?: 'incoming' | 'inprocess';
  sorting?: sorting[];
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
    | 'exchange-permission' // it refers to the url that I came from and the url that I have to go to
    | 'project-report'
    | 'incoming-amandment-requests'
    | 'complete-project-report';
  // example addCustomFilter: '&status=PENDING&include_relations=supervisor,sender,proposal'
  // addCustomFilter?: string;
  addCustomFilter?: T;
  // for redirect link, button view all
  navigateLink?: string;
  showPagination?: boolean;
  onSearch?: boolean;
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

export type CardSearchingProps = {
  title: string;
  limitShowCard?: number;
  data?: ProjectCardProps[];
  pagination?: boolean;
  cardFooterButtonAction:
    | 'show-project' // Without the action bar at the end of the page.
    | 'show-details' // With the action bar at the end if the page.
    | 'completing-exchange-permission' // With the action bar at the end if the page.
    | 'draft'; // Without the action bar at the end of the page, but with the ability to continue or remove the project.
};

export type NewCardTableProps = {
  title: string;
  limitShowCard?: number;
  data?: ProjectCardProps[];
  pagination?: boolean;
  url: string;
  headersProps: { [key: string]: string };
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

export type FilteredValues = {
  data?: any;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  limit?: number;
  message?: string;
  nextPage?: number;
  prevPage?: number;
  total: number;
};

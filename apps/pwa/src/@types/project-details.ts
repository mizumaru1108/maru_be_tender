export type UpdateAction =
  | 'ACCEPT'
  | 'REJECT'
  | 'EDIT_REQUEST'
  | 'SEND_CLIENT_MESSAGE'
  | 'STEP_BACK'
  | 'ACCEPT_CONSULTANT'
  | 'PENDING_REQUEST'
  | '';

export type ModalProposalType = {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
};

export type AcceptingModalProposalType = {
  action: { type: UpdateAction; isOpen: boolean };
  onClose: () => void;
  onSubmit: (data: any) => void;
  amount_required_fsupport: number;
  project_track: string;
};

export interface PendingRequest {
  pending_date: string;
  notes: string;
}

export interface ProjectOwnerDetails {
  entity: string;
  user: {
    email: string;
  };
  phone: string;
  region: string;
  governorate: string;
  center_administration: string;
  license_number: string;
  license_issue_date: string;
  headquarters: string;
}

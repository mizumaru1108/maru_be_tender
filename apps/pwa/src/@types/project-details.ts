export type UpdateAction =
  | 'ACCEPT'
  | 'REJECT'
  | 'EDIT_REQUEST'
  | 'SEND_CLIENT_MESSAGE'
  | 'STEP_BACK'
  | 'ACCEPT_CONSULTANT'
  | '';

export type ModalProposalType = {
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export type AcceptingModalProposalType = {
  action: { type: UpdateAction; isOpen: boolean };
  onClose: () => void;
  onSubmit: (data: any) => void;
  amount_required_fsupport: number;
  project_track: string;
};

export interface Cheques {
  transfer_receipt: string;
  id: string;
}

export interface Payments {
  id: string;
  payment_date: string;
  status: string;
  cheques: Cheques[];
}

export interface Notifications {
  id: string;
  appointment_id: string;
  subject: string;
  content: string;
  read_status: boolean;
  created_at: Date;
  type: string;
  proposal: {
    id: string;
    inner_status: string;
    outter_status: string;
    state: string;
    payments: Payments[];
  };
  appointment: {
    id: string;
    calendar_url: string;
    meeting_url: string;
    client: {
      id: string;
      employee_name: string;
      email: string;
      created_at: string;
      client_data: {
        entity: string;
        authority: string;
      };
    };
  };
}

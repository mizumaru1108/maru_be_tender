export interface IAvailableTime {
  //export
  day: string;
  time_gap: string[];
}
export interface IAvailableDay {
  //export
  days: string[];
  time: IAvailableTime[];
}

export interface IAppointmentsTime {
  //export
  date: string;
  day: string;
  start_time: string;
  end_time: string;
}
export interface IAppointments {
  //export
  days?: string[];
  time?: IAppointmentsTime[];
}
export interface ISelectedDate {
  //export
  date?: string;
  day?: string;
  month?: string;
  year?: string;
}
export interface IArrayAppointments {
  //export
  id: string;
  employee_id: string;
  user_id: string;
  meeting_url: string;
  calendar_url: string;
  date: Date;
  start_time: string;
  end_time: string;
  reject_reason: string;
  status: string;
  day: string;
  created_at: Date;
  updated_at: Date;
  calendar_event_id: string;
  employee_name: string;
}

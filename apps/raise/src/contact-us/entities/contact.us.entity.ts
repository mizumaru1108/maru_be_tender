export class ContactUsEntity {
  id: string;
  inquiry_type: string;
  title?: string | null;
  message?: string | null;
  date_of_visit?: number | null;
  reason_visit?: string | null;
  created_at?: Date | null = new Date();
  udpated_at?: Date | null = new Date();
}

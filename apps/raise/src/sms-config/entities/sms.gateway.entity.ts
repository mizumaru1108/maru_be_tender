export class SmsGatewayEntity {
  id: string;
  api_key: string;
  user_sender: string;
  username: string;
  is_active: boolean = false;
  is_default: boolean = false;
  is_deleted: boolean = false;
}

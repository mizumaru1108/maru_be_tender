import { ApiProperty } from '@nestjs/swagger';

export class InsertPaymentLogResponse {
  @ApiProperty()
  data: {
    proposal: {
      user: {
        id: string;
        employee_name: string | null;
        email: string;
        mobile_number: string | null;
      };
    };
    created_at: Date;
    action: string | null;
    reviewer: {
      id: string;
      employee_name: string | null;
      email: string;
      mobile_number: string | null;
    } | null;
  };
}

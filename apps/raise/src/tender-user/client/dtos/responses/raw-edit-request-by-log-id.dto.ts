import { ApiProperty } from '@nestjs/swagger';
import {
  bank_information,
  client_data,
  edit_request_logs,
  edit_requests,
} from '@prisma/client';

export class RawEditRequestByLogIdDto {
  @ApiProperty()
  data:
    | (edit_requests & {
        user: {
          client_data: client_data | null;
          bank_information: bank_information[];
        };
        edit_request_logs: edit_request_logs[];
      })
    | null;
}

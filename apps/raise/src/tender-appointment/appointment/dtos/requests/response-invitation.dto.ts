import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsIn,
  IsUUID,
} from 'class-validator';

export class InvitationResponseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authCode?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  appointmentId: string;

  // * - "declined" - The attendee has declined the invitation.
  // * - "tentative" - The attendee has tentatively accepted the invitation.
  // * - "accepted" - The attendee has accepted the invitation.  Warning: If you add an event using the values declined, tentative, or accepted, attendees with the "Add invitations to my calendar" setting set to "When I respond to invitation in email" won't see an event on their calendar unless they choose to change their invitation response in the event invitation email.
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['confirmed', 'declined'], {
    message: 'response must be confirmed or declined',
  })
  response: 'confirmed' | 'declined';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  reject_reason?: string;
}

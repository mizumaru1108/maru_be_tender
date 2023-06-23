import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateObjectIdDecorator } from 'src/commons/decorators/validate-object-id.decorator';

export class GSRegisterRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationEmail?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  domainUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mobile?: string;
}

export class GSVerifyUser {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiPropertyOptional()
  @IsOptional()
  organization_id?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  donor_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  donor_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  domain_url?: string;
}

export class GSResetPassword {
  @ApiPropertyOptional()
  @IsOptional()
  organization_id?: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  domain_url: string;
}

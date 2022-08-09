import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsString } from "class-validator";
import { IsActive } from "../enums";



export class NonProfitAppearancePageDto {

  @ApiProperty()
  @IsString()
  id: string;

  @IsString()
  ownerUserId: string;

  @IsString()
  ownerRealmId: string;

  @IsEmail()
  contactUsCsEmail: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly disclaimer: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly faq: string[];

  @IsString()
  organizationId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class EditNonProfitAppearancePageDto {

  @ApiProperty()
  @IsString()
  id: string;

  @IsString()
  organizationId: string;

  @IsString()
  ownerUserId: string;

  @IsString()
  ownerRealmId: string;

  @IsEmail()
  contactUsCsEmail: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly disclaimer: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly faq: string[];

  @ApiProperty()
  @IsEnum(() => IsActive)
  isDeleted: IsActive;

  @ApiProperty()
  @IsEnum(() => IsActive)
  isActive: IsActive;

  @IsString()
  updatedAt: string;
}

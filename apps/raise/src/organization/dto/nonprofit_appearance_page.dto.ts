import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { IsActive } from "../enums";



export class NonProfitAppearancePageDto {

  @IsString()
  @IsOptional()
  ownerUserId: string;

  @IsString()
  @IsOptional()
  ownerRealmId: string;

  @IsEmail()
  @IsOptional()
  contactUsCsEmail: string;

  @IsString()
  @IsOptional()
  readonly disclaimer: string;

  @IsArray()
  @IsOptional()
  readonly faq: string[];

  @IsOptional()
  @IsString()
  organizationId: string;

  @IsString()
  @IsOptional()
  createdAt: string;

  @IsString()
  @IsOptional()
  updatedAt: string;

  @IsString()
  @IsOptional()
  latitude: string;

  @IsString()
  @IsOptional()
  longitude: string;

  @IsArray()
  @IsOptional()
  privacyPolicy: string[];
}

export class EditNonProfitAppearancePageDto extends NonProfitAppearancePageDto {

}

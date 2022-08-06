import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsString } from "class-validator";



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
  /**Array Of Object */
  readonly disclaimer: string[];
  /**--------------- */

  @IsArray()
  @ArrayNotEmpty()
  /**Array Of Object {question:"",answer:""} */
  readonly faq: string[];
  /**--------------- */
  @IsString()
  organizationId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

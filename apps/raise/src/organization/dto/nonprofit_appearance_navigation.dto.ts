import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsString } from "class-validator";

export class NonProfitAppearanceNavigationDto {

  id: string;

  @ApiProperty()
  @IsString()
  ownerUserId: string;
  @ApiProperty()
  @IsString()
  ownerRealmId: string;
  @ApiProperty()
  @IsString()
  titleThumbnail: string;
  @ApiProperty()
  @IsString()
  photoThumbnail: string;
  @ApiProperty()
  @IsString()
  descriptionThumbnail: string;

  @ApiProperty()
  @IsArray()
  /** Company Value Array of Object */
  mission: string[];
  /** ------------------------------ */
  @ApiProperty()
  @IsString()
  iconForMission: string;

  @ApiProperty()
  @IsString()
  titleActivities: string;
  @ApiProperty()
  @IsString()
  photoOfActivity: string;
  @ApiProperty()
  @IsString()
  descriptionActivity: string;
  @ApiProperty()
  @IsString()
  detailDescriptionActivity: string;

  @ApiProperty()
  @IsArray()
  /** Caompany Value Array of Object {whyUs:"",iconForMission:""} */
  whyUs: string[];
  /** ------------------------------ */

  /** Caompany Value Array of Object */
  @ApiProperty()
  @IsArray()
  linkCampaign: string[];
  /** ------------------------------ */

  @ApiProperty()
  @IsString()
  page: string;
}

export class NonProfitAppearanceNavigationAboutUsDto {

  id: string;
  @ApiProperty()
  @IsString()
  ownerUserId: string;
  @ApiProperty()
  @IsString()
  ownerRealmId: string;
  @ApiProperty()
  @IsString()

  titleThumbnail: string;
  @ApiProperty()
  @IsString()
  photoThumbnail: string;
  @ApiProperty()
  @IsString()
  descriptionThumbnail: string;

  @ApiProperty()
  @IsArray()
  /** Company Value Array of Object */
  vision: string[];
  /** ------------------------------ */
  @ApiProperty()
  @IsString()
  iconForMission: string;

  @ApiProperty()
  @IsString()
  linkedYoutube: string;

  @ApiProperty()
  @IsArray()
  /** Caompany Value Array of Object */
  companyValues: string[];
  /** ------------------------------ */

  @ApiProperty()
  @IsString()
  iconForValues: string;

  @ApiProperty()
  @IsArray()
  /** Caompany Value Array of Object */
  teamMemberAddUser: string[];
  /** ------------------------------ */

  @ApiProperty()
  @IsString()
  page: string;
}
export class NonProfitAppearanceNavigationBlogDto {

  id: string;

  @ApiProperty()
  @IsString()
  ownerUserId: string;
  @ApiProperty()
  @IsString()
  ownerRealmId: string;

  @ApiProperty()
  @IsString()
  titleThumbnail: string;
  @ApiProperty()
  @IsString()
  photoThumbnail: string;
  @ApiProperty()
  @IsString()
  descriptionThumbnail: string;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsArray()
  /** News Setting Page Blog {news:"",photo:"",desc:"",date:""} */
  news: string[];
  /** ------------------------------ */

  @ApiProperty()
  @IsString()
  page: string;
}
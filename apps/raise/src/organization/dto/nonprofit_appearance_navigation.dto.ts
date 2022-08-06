import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsString } from "class-validator";
import { PageNavigation } from "../enums";

export class NonProfitAppearanceNavigationDto {

  id: string;

  @ApiProperty()
  @IsString()
  readonly ownerUserId: string;
  @ApiProperty()
  @IsString()
  readonly ownerRealmId: string;
  @ApiProperty()
  @IsString()
  readonly titleThumbnail: string;
  @ApiProperty()
  @IsString()
  readonly photoThumbnail: string;
  @ApiProperty()
  @IsString()
  readonly descriptionThumbnail: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  /** Company Value Array of Object */
  readonly mission: string[];
  /** ------------------------------ */
  @ApiProperty()
  @IsString()
  readonly iconForMission: string;

  @ApiProperty()
  @IsString()
  readonly titleActivities: string;
  @ApiProperty()
  @IsString()
  readonly photoOfActivity: string;
  @ApiProperty()
  @IsString()
  readonly descriptionActivity: string;
  @ApiProperty()
  @IsString()
  readonly detailDescriptionActivity: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  /** Caompany Value Array of Object {whyUs:"",iconForMission:""} */
  readonly whyUs: string[];
  /** ------------------------------ */

  /** Caompany Value Array of Object */
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly linkCampaign: string[];
  /** ------------------------------ */

  @ApiProperty()
  @IsString()
  page: string = 'LANDINGPAGE';

  @IsString()
  organizationId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
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
  page: string = 'ABOUTUS';

  @IsString()
  organizationId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
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
  page: string = 'BLOG';

  @IsString()
  organizationId: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
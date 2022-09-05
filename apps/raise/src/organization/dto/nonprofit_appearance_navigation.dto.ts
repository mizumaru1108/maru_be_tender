import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ImagePayload } from "src/commons/dtos/image-payload.dto";
import { z } from "zod";
import { PageNavigation, IsActive } from "../enums";

const missionDto = z.object({
  mission: z.string().min(1),
  iconMission: z.string(ImagePayload),
})
const whyUsDto = z.object({
  whyUs: z.string().min(1),
  iconWhyUs: z.string(ImagePayload),
})

export const NonProfitAppearanceNavigationDto = z.object({
  organizationId: z.string().optional(),
  ownerUserId: z.string().optional(),
  ownerRealmId: z.string().optional(),
  titleThumbnail: z.string().optional(),
  photoThumbnail: z.string().optional(),
  descriptionThumbnail: z.string().optional(),
  mission: z.array(missionDto),
  iconForMission: z.string().optional(),
  titleActivities: z.string().optional(),
  photoOfActivity: z.string().optional(),
  descriptionActivity: z.string().optional(),
  detailDescriptionActivity: z.string().optional(),
  whyUs: z.array(whyUsDto),
  linkCampaign: z.string().optional(),
  page: z.string().default('LANDINGPAGE'),
  isDeleted: z.nativeEnum(IsActive),
  createdAt: z.string(),
  updatedAt: z.string(),
  photoThumbnailUl: z.array(ImagePayload).optional(),
  iconForMissionUl: z.array(ImagePayload).optional(),
  photoOfActivityUl: z.array(ImagePayload).optional(),
});
export type NonProfitAppearanceNavigationDto = z.infer<typeof NonProfitAppearanceNavigationDto>;

export const EditNonProfApperNavDto = NonProfitAppearanceNavigationDto.partial().extend({
  mission: z.array(missionDto),
  whyUs: z.array(whyUsDto)
});
export type EditNonProfApperNavDto = z.infer<typeof EditNonProfApperNavDto>;

// export class EditNonProfitAppearanceNavigationDto {
//   @ApiProperty()
//   id: string;
//   @ApiProperty()
//   @IsString()
//   organizationId: string;
//   @ApiProperty()
//   @IsString()
//   readonly ownerUserId: string;
//   @ApiProperty()
//   @IsString()
//   readonly ownerRealmId: string;
//   @ApiProperty()
//   @IsString()
//   readonly titleThumbnail: string;
//   @ApiProperty()
//   @IsString()
//   readonly photoThumbnail: string;
//   @ApiProperty()
//   @IsString()
//   readonly descriptionThumbnail: string;
//   @ApiProperty()
//   @IsArray()
//   @ArrayNotEmpty()
//   readonly mission: string[];
//   @ApiProperty()
//   @IsString()
//   readonly iconForMission: string;
//   @ApiProperty()
//   @IsString()
//   readonly titleActivities: string;
//   @ApiProperty()
//   @IsString()
//   readonly photoOfActivity: string;
//   @ApiProperty()
//   @IsString()
//   readonly descriptionActivity: string;
//   @ApiProperty()
//   @IsString()
//   readonly detailDescriptionActivity: string;
//   @ApiProperty()
//   @IsArray()
//   @ArrayNotEmpty()
//   readonly whyUs: string[];
//   @ApiProperty()
//   @IsArray()
//   @ArrayNotEmpty()
//   readonly linkCampaign: string[];
//   @ApiProperty()
//   @IsEnum(() => IsActive)
//   isDeleted: IsActive;
//   @ApiProperty()
//   @IsEnum(() => IsActive)
//   isActive: IsActive;
//   @IsString()
//   updatedAt: string;
// }

const vision = z.object({
  vision: z.string().optional()
});
const companyValues = z.object({
  companyValues: z.string().optional()
});
const teamMemberAddUser = z.object({
  teamMemberAddUser: z.string().optional()
});
const news = z.object({
  news: z.string().optional()
});

export const NonProfitAppearanceNavigationAboutUsDto = z.object({
  organizationId: z.string().optional(),
  ownerUserId: z.string().optional(),
  ownerRealmId: z.string().optional(),
  titleThumbnail: z.string().optional(),
  photoThumbnail: z.string().optional(),
  descriptionThumbnail: z.string().optional(),
  vision: z.array(vision),
  iconForMission: z.string().optional(),
  linkedYoutube: z.string().optional(),
  companyValues: z.array(companyValues),
  iconForValues: z.string().optional(),
  teamMemberAddUser: z.array(teamMemberAddUser),
  page: z.string().default('ABOUTUS'),
  isDeleted: z.nativeEnum(IsActive),
  isActive: z.nativeEnum(IsActive),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  photoThumbnailUl: z.array(ImagePayload).optional(),
  news: z.array(news).optional(),
  iconForValuesUl: z.array(ImagePayload).optional(),
})

export type NonProfitAppearanceNavigationAboutUsDto = z.infer<typeof NonProfitAppearanceNavigationAboutUsDto>;

export const EditNonProfApperNavAboutUsDto = NonProfitAppearanceNavigationAboutUsDto.partial().extend({
});
export type EditNonProfApperNavAboutUsDto = z.infer<typeof EditNonProfApperNavAboutUsDto>;


export class EditNonProfitAppearanceNavigationAboutUsDto {

  // @IsString()
  // id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  organizationId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ownerUserId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ownerRealmId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  titleThumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  photoThumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descriptionThumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  vision: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  iconForMission: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  linkedYoutube: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  companyValues: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  iconForValues: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(IsActive)
  isDeleted: IsActive;

  @ApiProperty()
  @IsOptional()
  @IsEnum(IsActive)
  isActive: IsActive;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  teamMemberAddUser: string[];

  @IsString()
  @IsOptional()
  updatedAt: string;

  @IsArray()
  photoThumbnailUl: string[]
  @IsArray()
  iconForValuesUl: string[]
}

export class NonProfitAppearanceNavigationBlogDto {

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

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
  news: string[];

  @ApiProperty()
  @IsString()
  page: string = 'BLOG';

  @ApiProperty()
  @IsEnum(() => IsActive)
  isDeleted: IsActive;

  @ApiProperty()
  @IsEnum(() => IsActive)
  isActive: IsActive;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class EditNonProfitAppearanceNavigationBlogDto {

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

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
  @IsEnum(() => IsActive)
  isDeleted: IsActive;

  @ApiProperty()
  @IsEnum(() => IsActive)
  isActive: IsActive;

  @ApiProperty()
  @IsArray()
  news: string[];

  @IsString()
  updatedAt: string;
}

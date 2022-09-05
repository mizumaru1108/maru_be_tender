import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
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

// export class NonProfitAppearanceNavigationDto {
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
//   // @IsArray()
//   // @ArrayNotEmpty()
//   // readonly mission: string[];
// mission
//   // mission: 
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
//   @IsString()
//   page: string = 'LANDINGPAGE';
//   @ApiProperty()
//   @IsEnum(() => IsActive)
//   isDeleted: IsActive;
//   @ApiProperty()
//   @IsEnum(() => IsActive)
//   isActive: IsActive;
//   @IsString()
//   createdAt: string;
//   @IsString()
//   updatedAt: string;
// }
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
});
export type NonProfitAppearanceNavigationDto = z.infer<typeof NonProfitAppearanceNavigationDto>;
export const EditNonProfApperNavDto = NonProfitAppearanceNavigationDto.partial().extend({
  mission: missionDto,
  whyUs: whyUsDto
});

export type EditNonProfApperNavDto = z.infer<typeof EditNonProfApperNavDto>;

export class EditNonProfitAppearanceNavigationDto {

  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  organizationId: string;

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
  readonly mission: string[];

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
  readonly whyUs: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly linkCampaign: string[];

  @ApiProperty()
  @IsEnum(() => IsActive)
  isDeleted: IsActive;

  @ApiProperty()
  @IsEnum(() => IsActive)
  isActive: IsActive;

  @IsString()
  updatedAt: string;
}

export class NonProfitAppearanceNavigationAboutUsDto {

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
  @IsArray()
  vision: string[];

  @ApiProperty()
  @IsString()
  iconForMission: string;

  @ApiProperty()
  @IsString()
  linkedYoutube: string;

  @ApiProperty()
  @IsArray()
  companyValues: string[];

  @ApiProperty()
  @IsString()
  iconForValues: string;

  @ApiProperty()
  @IsArray()
  teamMemberAddUser: string[];

  @ApiProperty()
  @IsString()
  page: string = 'ABOUTUS';

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

export class EditNonProfitAppearanceNavigationAboutUsDto {

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
  @IsArray()
  vision: string[];

  @ApiProperty()
  @IsString()
  iconForMission: string;

  @ApiProperty()
  @IsString()
  linkedYoutube: string;

  @ApiProperty()
  @IsArray()
  companyValues: string[];

  @ApiProperty()
  @IsString()
  iconForValues: string;

  @ApiProperty()
  @IsEnum(() => IsActive)
  isDeleted: IsActive;

  @ApiProperty()
  @IsEnum(() => IsActive)
  isActive: IsActive;

  @ApiProperty()
  @IsArray()
  teamMemberAddUser: string[];

  @IsString()
  updatedAt: string;
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

// const UpdateLandingPge = NonProfitAppearanceNavigationDto.partial().extend({
//   images: z
//     .array(ImagePayload)
//     .optional()
//     .transform((val) => {
//       if (!val) {
//         return {} as any;
//       }
//       return val;
//     }),
// });

// export type UpdateCampaignDto = z.infer<typeof UpdateCampaignDto>;
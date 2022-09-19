import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { CoordiateLocation } from '../../commons/dtos/location.dto';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectNearbyPlaces } from './project-nearby-places';

export type ProjectDocument = Project & Document;
export type ProjectOperatorLogDocument = ProjectOperatorLog & Document;

@Schema({ collection: 'projectOperatorLog' })
export class ProjectOperatorLog {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  projectId: Types.ObjectId;

  @Prop()
  operatorId: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: mongoose.Schema.Types.Date,
  })
  createdAt: string;

  @Prop({
    type: mongoose.Schema.Types.Date,
    default: mongoose.Schema.Types.Date,
  })
  updatedAt: string;

  @Prop()
  status: string;
}

@Schema({
  collection: 'project',
  timestamps: true, // will created CreatedAt and UpdatedAt fields automatically
})
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  public _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'organization' })
  public organizationId: Types.ObjectId;

  @Prop({ ref: 'projectOperatorLog' })
  public operatorId?: string;

  @Prop()
  public creatorUserId: string;

  @Prop()
  public updaterUserId: string;

  @Prop({ default: null })
  public applierUserId?: string;

  @Prop({ enum: ProjectStatus, default: ProjectStatus.PENDING })
  public projectStatus: ProjectStatus;

  @Prop({ required: true })
  public name: string;

  @Prop()
  public country: string;

  @Prop()
  public city: string;

  @Prop()
  public address: string;

  @Prop({ default: null })
  public coordinate?: CoordiateLocation;

  @Prop()
  public description: string;

  @Prop()
  public diameterSize: number;

  @Prop()
  public prayerSize: number;

  @Prop()
  public toiletSize: number;

  @Prop()
  public hasAc: string;

  @Prop()
  public hasClassroom: string;

  @Prop()
  public hasParking: string;

  @Prop()
  public hasGreenSpace: string;

  @Prop()
  public hasFemaleSection: string;

  @Prop({ default: 'N' })
  public isDeleted: string;

  @Prop({ default: 'N' })
  public isPublished: string;

  @Prop()
  public coverImage?: string;

  @Prop()
  public image1?: string;

  @Prop()
  public image2?: string;

  @Prop()
  public image3?: string;

  @Prop({})
  public projectAvatar?: string;

  @Prop({ default: null })
  public rejectReason?: string;

  @Prop({ default: [] })
  public nearByPlaces?: ProjectNearbyPlaces[];

  @Prop({ default: null })
  public appliedAt?: Date;

  /**
   * i don't use props decorator here, it's just for accessing the auto created fields
   * @example Comment.createdAt
   */
  public createdAt?: Date;

  public updatedAt?: Date;

  /**
   * it could use both of the dto, becouse th diffrence is only the processing on the image processing
   */
  public static mapFromRequest(
    scheme: ProjectDocument,
    request: ProjectCreateDto | ProjectUpdateDto,
  ): ProjectDocument {
    if (!scheme._id) scheme._id = new Types.ObjectId();
    scheme.organizationId = new Types.ObjectId(request.organizationId);
    scheme.name = request.name;
    scheme.description = request.description;
    scheme.country = request.country;
    scheme.city = request.city;
    scheme.address = request.address;
    scheme.coordinate = request.coordinate;
    scheme.diameterSize = request.diameterSize;
    scheme.prayerSize = request.prayerSize;
    scheme.toiletSize = request.toiletSize;
    scheme.hasAc = request.hasAc;
    scheme.hasClassroom = request.hasClassroom;
    scheme.hasParking = request.hasParking;
    scheme.hasGreenSpace = request.hasGreenSpace;
    scheme.hasFemaleSection = request.hasFemaleSection;
    scheme.nearByPlaces = request.nearByPlaces;
    if (request.nearByPlaces) {
      const nearBy = request.nearByPlaces.map((nearByPlace) => {
        const nearby = ProjectNearbyPlaces.mapFromCreateRequest(nearByPlace);
        return nearby;
      });
      scheme.nearByPlaces = nearBy;
    }
    return scheme;
  }
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const ProjectOperatorLogSchema =
  SchemaFactory.createForClass(ProjectOperatorLog);

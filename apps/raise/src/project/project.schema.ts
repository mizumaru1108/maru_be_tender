import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { UpdateProjectDto } from './dto/update-project.dto';

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

@Schema({ collection: 'project' })
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  public _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'organization' })
  public organizationId: Types.ObjectId;

  @Prop({ type: () => String, ref: 'projectOperatorLog' })
  public operatorId?: string;

  @Prop({ required: true })
  public name: string;

  @Prop()
  public address?: string;

  @Prop()
  public description?: string;

  @Prop()
  public location?: string;

  @Prop()
  public diameterSize?: string;

  @Prop()
  public prayerSize?: string;

  @Prop()
  public toiletSize?: string;

  @Prop()
  public hasAc?: string;

  @Prop()
  public hasClassroom?: string;

  @Prop()
  public hasParking?: string;

  @Prop()
  public hasGreenSpace?: string;

  @Prop()
  public hasFemaleSection?: string;

  @Prop()
  public isDeleted?: string;

  @Prop()
  public isPublished?: string;

  @Prop()
  public coverImage?: string;

  @Prop()
  public image1?: string;

  @Prop()
  public image2?: string;

  @Prop()
  public image3?: string;

  @Prop()
  public projectAvatar?: string;

  @Prop({ default: [] })
  public nearByPlaces?: Array<Object>;

  @Prop()
  public createdAt?: string;

  @Prop()
  public updatedAt?: string;

  static compare(
    currentData: ProjectDocument,
    request: UpdateProjectDto,
  ): ProjectDocument {
    if (request.organizationId) {
      currentData.organizationId = new Types.ObjectId(request.organizationId);
    }
    request.name && (currentData.name = request.name);
    request.description && (currentData.description = request.description);
    request.address && (currentData.address = request.address);
    request.nearByPlaces && (currentData.nearByPlaces = request.nearByPlaces);
    request.location && (currentData.location = request.location);
    request.diameterSize && (currentData.diameterSize = request.diameterSize);
    request.prayerSize && (currentData.prayerSize = request.prayerSize);
    request.toiletSize && (currentData.toiletSize = request.toiletSize);
    request.hasAc && (currentData.hasAc = request.hasAc);
    request.hasClassroom && (currentData.hasClassroom = request.hasClassroom);
    request.hasParking && (currentData.hasParking = request.hasParking);
    request.hasGreenSpace &&
      (currentData.hasGreenSpace = request.hasGreenSpace);
    request.hasFemaleSection &&
      (currentData.hasFemaleSection = request.hasFemaleSection);
    currentData.updatedAt = dayjs().toISOString();
    return currentData;
  }
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const ProjectOperatorLogSchema =
  SchemaFactory.createForClass(ProjectOperatorLog);

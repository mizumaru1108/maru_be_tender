import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
  ProjectVendorLog,
  ProjectVendorLogDocument,
} from './project.schema';
import { Operator, OperatorSchema } from '../operator/schema/operator.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: Operator.name,
        schema: OperatorSchema,
      },
      // {
      //   name: ProjectVendorLog.name,
      //   schema: ProjectSchema,
      // },
    ]),
    ConfigModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}

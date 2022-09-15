import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from '../operator/schema/operator.schema';
import { ProjectController } from './project.controller';
import {
  Project,
  ProjectOperatorLog,
  ProjectOperatorLogSchema,
  ProjectSchema,
} from './schema/project.schema';
import { ProjectService } from './project.service';
import { User, UserSchema } from '../user/schema/user.schema';

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
      {
        name: ProjectOperatorLog.name,
        schema: ProjectOperatorLogSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}

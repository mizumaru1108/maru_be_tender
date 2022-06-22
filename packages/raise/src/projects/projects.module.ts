import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectsSchema } from './projects.schema';
import { Operator, OperatorSchema } from '../operator/schema/operator.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Projects.name,
        schema: ProjectsSchema,
      },
      {
        name: Operator.name,
        schema: OperatorSchema,
      },
    ]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}

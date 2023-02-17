import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notifications,
  NotificationsSchema,
} from 'src/organization/schema/notifications.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: Notifications.name,
        schema: NotificationsSchema,
      },
    ]),
  ],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}

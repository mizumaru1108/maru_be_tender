import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ContactUs,
  client_data,
  edit_requests,
  file_manager,
  message,
  notification,
  proposal,
  room_chat,
  user,
  user_role,
  user_status_log,
} from '@prisma/client';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';

export class PurgeUserCommand {
  user_id: string;
}

export class PurgeUserCommandResult {
  data: {
    client_data: client_data[];
    file_manager: file_manager[];
    notifications: notification[];
    user_role: user_role[];
    user_status_log: user_status_log[];
    message: message[];
    room_chat: room_chat[];
    contact_us: ContactUs[];
    edit_requests: edit_requests[];
    proposals: proposal[];
    user: user[];
  };
}

@CommandHandler(PurgeUserCommand)
export class PurgeUserCommandHandler
  implements ICommandHandler<PurgeUserCommand, PurgeUserCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  async execute(command: PurgeUserCommand): Promise<PurgeUserCommandResult> {
    try {
      const deleted_bank = await this.prismaService.bank_information.findMany({
        where: { user_id: command.user_id },
      });
      const deleted_bank_ids = deleted_bank.map((bank) => bank.id);

      const client_data = await this.prismaService.client_data.findMany({
        where: { user_id: command.user_id },
      });
      const deleted_client_data_ids = client_data.map((client) => client.id);

      const file_manager = await this.prismaService.file_manager.findMany({
        where: { user_id: command.user_id },
      });
      const deleted_file_manager_ids: string[] = [];
      const deleted_file_manager_urls: string[] = [];
      file_manager.forEach((file) => {
        deleted_file_manager_ids.push(file.id);
        deleted_file_manager_urls.push(file.url);
      });

      const notifications = await this.prismaService.notification.findMany({
        where: { user_id: command.user_id },
      });
      const deleted_notification_ids = notifications.map(
        (notification) => notification.id,
      );

      const user_role = await this.prismaService.user_role.findMany({
        where: { user_id: command.user_id },
      });
      const deleted_user_role_ids = user_role.map((role) => role.id);

      const user_status_log = await this.prismaService.user_status_log.findMany(
        {
          where: { user_id: command.user_id },
        },
      );
      const deleted_user_status_log_ids = user_status_log.map(
        (status) => status.id,
      );

      const message = await this.prismaService.message.findMany({
        where: {
          OR: {
            owner_id: command.user_id,
            receiver_id: command.user_id,
          },
        },
      });
      const deleted_message_ids = message.map((message) => message.id);

      const room_chat = await this.prismaService.room_chat.findMany({
        where: {
          OR: {
            participant1_user_id: command.user_id,
            participant2_user_id: command.user_id,
          },
        },
      });
      const deleted_room_chat_ids = room_chat.map((room) => room.id);

      const contact_us = await this.prismaService.contactUs.findMany({
        where: {
          submitter_user_id: command.user_id,
        },
      });
      const deleted_contact_us_ids = contact_us.map(
        (contact) => contact.contact_us_id,
      );

      const edit_requests = await this.prismaService.edit_requests.findMany({
        where: {
          OR: {
            user_id: command.user_id,
            reviewer_id: command.user_id,
          },
        },
      });
      const deleted_edit_requests_ids = edit_requests.map(
        (edit_request) => edit_request.id,
      );

      const proposals = await this.prismaService.proposal.findMany({
        where: {
          submitter_user_id: command.user_id,
          cashier_id: command.user_id,
          finance_id: command.user_id,
          supervisor_id: command.user_id,
        },
      });
      const deleted_proposal_id = proposals.map((proposal) => proposal.id);

      const user = await this.prismaService.user.findMany({
        where: { id: command.user_id },
      });
      const deleted_user_id = user.map((user) => user.id);

      const res = await this.prismaService.$transaction(
        async (prismaSession) => {
          let deletedFileCount = 0;
          if (deleted_bank_ids.length > 0) {
            await prismaSession.bank_information.deleteMany({
              where: { id: { in: deleted_bank_ids } },
            });
          }

          if (deleted_client_data_ids.length > 0) {
            await prismaSession.client_data.deleteMany({
              where: { id: { in: deleted_client_data_ids } },
            });
          }

          if (deleted_file_manager_ids.length > 0) {
            const res = await prismaSession.file_manager.deleteMany({
              where: { id: { in: deleted_file_manager_ids } },
            });
            deletedFileCount = res.count;
          }

          if (deleted_notification_ids.length > 0) {
            await prismaSession.notification.deleteMany({
              where: { id: { in: deleted_notification_ids } },
            });
          }

          if (deleted_user_role_ids.length > 0) {
            await prismaSession.user_role.deleteMany({
              where: { id: { in: deleted_user_role_ids } },
            });
          }

          if (deleted_user_status_log_ids.length > 0) {
            await prismaSession.user_status_log.deleteMany({
              where: { id: { in: deleted_user_status_log_ids } },
            });
          }

          if (deleted_message_ids.length > 0) {
            await prismaSession.message.deleteMany({
              where: { id: { in: deleted_message_ids } },
            });
          }

          if (deleted_room_chat_ids.length > 0) {
            await prismaSession.room_chat.deleteMany({
              where: { id: { in: deleted_room_chat_ids } },
            });
          }

          if (deleted_contact_us_ids.length > 0) {
            await prismaSession.contactUs.deleteMany({
              where: { contact_us_id: { in: deleted_contact_us_ids } },
            });
          }

          if (deleted_edit_requests_ids.length > 0) {
            await prismaSession.edit_requests.deleteMany({
              where: { id: { in: deleted_edit_requests_ids } },
            });
          }

          if (deleted_proposal_id.length > 0) {
            await prismaSession.proposal.deleteMany({
              where: { id: { in: deleted_proposal_id } },
            });
          }

          if (deleted_user_id.length > 0) {
            await prismaSession.user.deleteMany({
              where: { id: { in: deleted_user_id } },
            });
          }

          await this.fusionAuthService.fusionAuthDeleteUser(command.user_id);

          return {
            deletedFileCount: deletedFileCount,
          };
        },
        {
          timeout: 120000,
        },
      );

      if (deleted_file_manager_ids.length === res.deletedFileCount) {
        for (const url of deleted_file_manager_urls) {
          await this.bunnyService.deleteMedia(url, true);
        }
      }

      const data = {
        client_data,
        file_manager,
        notifications,
        user_role,
        user_status_log,
        message,
        room_chat,
        contact_us,
        edit_requests,
        proposals,
        user,
      };

      return { data };
    } catch (error) {
      console.trace({ error });
      throw error;
    }
  }
}

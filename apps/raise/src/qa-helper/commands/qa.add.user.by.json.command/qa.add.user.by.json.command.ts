import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';

export class QAAddUserByJsonCommand {}

@CommandHandler(QAAddUserByJsonCommand)
export class QAAddUserByJsonCommandHandler
  implements ICommandHandler<QAAddUserByJsonCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  async execute(command: QAAddUserByJsonCommand): Promise<void> {
    try {
      const data = [
        // fill the user u want to create, ex:
        {
          fusionauth_id: '2547d620-c9c1-11ed-9194-02daaaaaaaaa',
          email: 'test@lorem.com',
          employee_name: 'dudududdu',
          mobile_number: '12345667',
          uid: 123123,
        },
      ];

      if (data.length > 0) {
        await this.prismaService.$transaction(async (session) => {
          for (const user of data) {
            await session.user.create({
              data: {
                id: user.fusionauth_id,
                employee_name: user.employee_name,
                email: user.email,
                mobile_number: user.mobile_number,
                uid: user.uid,
                status_id: 'ACTIVE_ACCOUNT',
              },
            });

            await session.user_role.create({
              data: {
                user_id: user.fusionauth_id,
                user_type_id: 'CLIENT',
              },
            });

            // await this.fusionAuthService.fusionAuthTenderRegisterUser({
            //   user_id: user.fusionauth_id,
            //   email: user.email,
            //   employee_name: user.employee_name,
            //   password: '12345678',
            //   mobile_number: user.mobile_number,
            //   user_roles: ['CLIENT'],
            //   email_verified: true,
            // });
          }
        });
      }
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}

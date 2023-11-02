import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma/prisma.service';

export class QAAddClientDataByJsonCommand {}

@CommandHandler(QAAddClientDataByJsonCommand)
export class QAAddClientDataByJsonCommandHandler
  implements ICommandHandler<QAAddClientDataByJsonCommand>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: QAAddClientDataByJsonCommand): Promise<void> {
    try {
      // license file example
      //{"url": "https://sys.hcharity.org/sys/sites/default/files/reg/ التسجيل الجديدة للجمعية (1) (1).pdf", "size": 390167, "type": "application/pdf"}

      // cont_mang_name = ceo_name
      // cont_mang_mob2 = chairman_mobile
      // reg_mob =entity mobile and data entry mobile
      // cont_mang_mob = client_data.ceo_mobile

      // get from
      // select trt.*, tr.reg_site, tr.reg_twit from type_reg_trf trt
      // join type_reg tr on trt.nid = tr.nid

      const data: any = [{}];

      if (data && data.length > 0) {
        await this.prismaService.$transaction(
          async (session) => {
            for (const user of data) {
              // find user by the id
              const rawUser = await session.user.findFirst({
                where: {
                  id: user.fusionauth_id,
                },
              });

              // if not exist
              if (!rawUser) {
                console.log(`user ${user.fusionauth_id} does not exist!`);
              }

              // if exist
              if (rawUser) {
                // search from bank info
                const userBank = await session.bank_information.findFirst({
                  where: {
                    user_id: user.fusionauth_id,
                  },
                });

                if (!userBank) {
                  // if bank not exist
                  const createdBanks = await session.bank_information.create({
                    data: {
                      user_id: user.fusionauth_id,
                      bank_account_name: user.reg_bank_account_name,
                      bank_account_number: user.reg_bank_account_num,
                    },
                  });
                  console.log({ createdBanks });
                }

                if (userBank) {
                  console.log('user bank exist');
                }

                // search for the client data
                const clientData = await session.client_data.findFirst({
                  where: {
                    user_id: user.fusionauth_id,
                    id: user.client_data_id,
                  },
                });

                type LicObj = {
                  url: string;
                  size: number;
                  type: string;
                };

                let licObj: any;
                if (
                  user.lic_file_filepath &&
                  user.lic_file_filesize &&
                  user.lic_file_filemime
                ) {
                  const obj: LicObj = {
                    url:
                      'https://sys.hcharity.org/sys/' + user.lic_file_filepath,
                    size: user.lic_file_filesize,
                    type: user.lic_file_filemime,
                  };
                  licObj = obj;
                }

                if (!clientData) {
                  //{"url": "https://sys.hcharity.org/sys/sites/default/files/reg/ التسجيل الجديدة للجمعية (1) (1).pdf", "size": 390167, "type": "application/pdf"}
                  console.log('client data does not exist, lets create one');
                  const createdClientData = await session.client_data.create({
                    data: {
                      id: user.client_data_id,
                      user_id: user.fusionauth_id,
                      license_number: user.lic_num,
                      license_expired: new Date(user.lic_edate),
                      license_issue_date: new Date(user.lic_sdate),
                      license_file: licObj || undefined,
                      website: user.reg_site || null,
                      twitter_acount: user.reg_twit || null,
                      entity: user.reg_name || null,
                      ceo_name: user.cont_mang_name || null,
                      ceo_mobile: user.cont_mang_mob
                        ? user.cont_mang_mob.toString()
                        : null,
                      chairman_mobile: user.cont_mang_mob2
                        ? user.cont_mang_mob2.toString()
                        : null,
                      // odec masi ??
                    },
                  });
                  console.log(createdClientData);
                }

                if (clientData) {
                  console.log('client data exist, update it');
                  const updatedClientData = await session.client_data.update({
                    where: {
                      id: user.client_data_id,
                    },
                    data: {
                      id: user.client_data_id,
                      user_id: user.fusionauth_id,
                      license_number: user.lic_num,
                      license_expired: new Date(user.lic_edate),
                      license_issue_date: new Date(user.lic_sdate),
                      license_file: licObj || undefined,
                      website: user.reg_site || null,
                      twitter_acount: user.reg_twit || null,
                      entity: user.reg_name || null,
                      ceo_name: user.cont_mang_name || null,
                      ceo_mobile: user.cont_mang_mob
                        ? user.cont_mang_mob.toString()
                        : null,
                      chairman_mobile: user.cont_mang_mob2
                        ? user.cont_mang_mob2.toString()
                        : null,
                    },
                  });
                  console.log(updatedClientData);
                }
              }
            }
          },
          {
            timeout: 500000,
          },
        );
      }
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}

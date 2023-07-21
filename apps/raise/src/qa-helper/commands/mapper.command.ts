import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
export class mapperuserCommand {}

@CommandHandler(mapperuserCommand)
export class mapperuserHandler implements ICommandHandler<mapperuserCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: mapperuserCommand): Promise<any> {
    const oldUser = await this.prismaService.user.findMany({
      where: {
        id: {
          in: [
            '59976329-be8d-4cd9-8682-dce44dd1a362',
            '9249491b-66e5-4b7d-a04d-ea8c685411f8',
            '9f25ff88-4283-46e2-9d92-abaec23dc6ed',
            '9095ccff-b77a-40ae-bc2f-a8982eb38be1',
            'aa700e49-a2d2-4b88-a586-eb750a1b1423',
            'cf3fac19-ce9e-41ac-9450-34e707b71c29',
            '3317d882-4975-452c-8b38-04f7cb29b673',
            '3d6277e6-88e9-4a78-9fed-0aa08c590896',
            '936eb911-c4d8-4dfd-9df8-f270ecf6e6c8',
            'eb31c936-78ba-471b-a994-a48572e956ea',
            '6b3935bf-b9e6-4061-9426-527111d5aa62',
            '4692e745-ff51-4a74-b50a-f17d6e9d4a64',
            '26a23900-2a49-4950-aa5a-917032b785f5',
            '68806bcd-5fad-4dec-84ae-01cb5e547fdd',
            'df9916bc-81fc-478c-bc45-bed74c63270c',
            'fe4aba39-de5a-44af-9d7c-e3b9d7aa843a',
            'bf9ae432-1078-45ec-a541-46e99ddc3ac5',
            'c708e830-f134-4afe-889e-9f253f94f458',
            '8e467af5-0501-4dbf-9246-5e9a8baae8cf',
            '9cd6fc8c-d9d0-41ad-8ba4-ee2bb3b2efe0',
            'd9b3dfe0-e93f-4d4a-a584-9a01e8cc34dc',
            'e1e7baa8-5504-4b16-b30e-8c2ac992ba2a',
            '74972d12-7c62-428d-b394-89880ee6489a',
          ],
        },
      },
    });

    console.log({ oldUser });
  }
}

import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios, { AxiosRequestConfig } from 'axios';
import { IDiscordConfig } from 'src/commons/configs/discord.config';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';

export class DiscordWebhookSendToChannelCommand {
  content: string;
  // embed references can be seen here
  // https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html
  embed?: Record<string, any>;
}

export class DiscordWebhookSendToChannelCommandResult {}

@CommandHandler(DiscordWebhookSendToChannelCommand)
export class DiscordWebhookSendToChannelCommandHandler
  implements
    ICommandHandler<
      DiscordWebhookSendToChannelCommand,
      DiscordWebhookSendToChannelCommandResult
    >
{
  constructor(private readonly configService: ConfigService) {}

  async execute(command: DiscordWebhookSendToChannelCommand): Promise<any> {
    if (command.content.length >= 2000) {
      throw new PayloadErrorException(
        'the message contents (up to 2000 characters)',
      );
    }

    // example
    // https://discord.com/api/webhooks/123123/sdcx234sdfaxczvasSASd12sdf
    const discordConfig =
      this.configService.get<IDiscordConfig>('discordConfig');

    const baseUrl = 'https://discord.com/api/webhooks';
    const channelId = discordConfig?.dcFusionAuthChannelId || '';
    const token = discordConfig?.dcFusionAuthToken || '';

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        content: command.content,
        embeds: command.embed,
      },
      url: `${baseUrl}/${channelId}/${token}`,
    };

    if (channelId !== '' && token !== '') {
      try {
        const data = await axios(options);
        return `success! ${data}`;
      } catch (error) {
        throw error;
      }
    }
  }
}

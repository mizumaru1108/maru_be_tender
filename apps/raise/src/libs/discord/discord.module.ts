import { Global, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DiscordWebhookSendToChannelCommandHandler } from 'src/libs/discord/commands/webhook.send.to.channel/send.to.channel.command';

const importedModule = [CqrsModule];
const repositories: Provider[] = [];
const commands: Provider[] = [DiscordWebhookSendToChannelCommandHandler];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [
  DiscordWebhookSendToChannelCommandHandler,
];

@Global()
@Module({
  imports: [...importedModule],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class DiscordModule {}

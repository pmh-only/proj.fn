import { type APIGatewayProxyCallbackV2 } from 'aws-lambda'
import { ApplicationCommandType, type APIApplicationCommand, type APIApplicationCommandInteraction, type APIInteractionResponseChannelMessageWithSource, InteractionResponseType } from 'discord-api-types/v10'
import { type Command } from './Command'
import { signResult } from '../crypto/sign'
import { listQueue } from '../queuing/listQueue'

export class QueueListCommand implements Command {
  public run = async (interaction: APIApplicationCommandInteraction, callback: APIGatewayProxyCallbackV2): Promise<void> => {
    const queue = await listQueue(interaction.guild_id ?? '')

    if (queue.length < 1) {
      callback(null, signResult<APIInteractionResponseChannelMessageWithSource>({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'Oops. queue is currently empty.'
        }
      }))
      return
    }

    callback(null, signResult<APIInteractionResponseChannelMessageWithSource>({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content:
          'Queue items:\n' +
          queue.map((item, i) =>
            `${i + 1}. ${item.musicTitle} -- ${item.musicCreator} ` +
            `(${Math.floor(item.musicDuration / 60)}m (${item.musicDuration % 60}s, ` +
            `added by <@${item.adderId}>)`).join('\n'),
        allowed_mentions: {
          parse: []
        }
      }
    }))
  }

  public getMetadata = (): Partial<APIApplicationCommand> => ({
    name: 'queue',
    description: 'List music queue of this server',
    type: ApplicationCommandType.ChatInput
  })
}

import { ApplicationCommandType, type APIApplicationCommand, type APIChatInputApplicationCommandGuildInteraction } from 'discord-api-types/v10'
import { type Command } from '../Command'
import { listQueue } from '../queuing/listQueue'
import { editOriginalRespond } from '../responder/editOriginalRespond'

export class QueueListCommand implements Command {
  public run = async (interaction: APIChatInputApplicationCommandGuildInteraction): Promise<void> => {
    const queue = await listQueue(interaction.guild_id)

    if (queue.length < 1) {
      await editOriginalRespond(interaction.token, {
        content: 'Oops. queue is currently empty.'
      })
      return
    }

    await editOriginalRespond(interaction.token, {
      content:
          'Queue items:\n' +
          queue.map((item, i) =>
            `${i + 1}. ${item.musicTitle} -- ${item.musicCreator} ` +
            `(${Math.floor(item.musicDuration / 60)}m ${item.musicDuration % 60}s, ` +
            `added by <@${item.adderId}>)`).join('\n'),
      allowed_mentions: {
        parse: []
      }
    })
  }

  public getMetadata = (): Partial<APIApplicationCommand> => ({
    name: 'queue',
    description: 'List music queue of this server',
    type: ApplicationCommandType.ChatInput
  })
}

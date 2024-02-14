import { type APIApplicationCommandInteraction, type APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10'

import { type Command } from '../Command'
import { editOriginalRespond } from '../responder/editOriginalRespond'

export class PingCommand implements Command {
  public run = async (interaction: APIApplicationCommandInteraction): Promise<any> => {
    await editOriginalRespond(interaction.token, {
      content: 'Pong!'
    })
  }

  public getMetadata = (): Partial<APIApplicationCommand> => ({
    name: 'ping',
    description: 'Show ping pong message',
    type: ApplicationCommandType.ChatInput
  })
}

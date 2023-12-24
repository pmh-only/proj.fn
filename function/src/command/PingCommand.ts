import { type APIGatewayProxyCallbackV2 } from 'aws-lambda'
import { type APIInteractionResponseChannelMessageWithSource, type APIApplicationCommandInteraction, InteractionResponseType, type APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/payloads/v10'

import { type Command } from './Command'
import { signResult } from '../crypto/sign'

export class PingCommand implements Command {
  public run = async (_: APIApplicationCommandInteraction, callback: APIGatewayProxyCallbackV2): Promise<any> => {
    callback(null, signResult<APIInteractionResponseChannelMessageWithSource>({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'Pong!'
      }
    }))
  }

  public getMetadata = (): Partial<APIApplicationCommand> => ({
    name: 'ping',
    description: 'Show ping pong message',
    type: ApplicationCommandType.ChatInput
  })
}

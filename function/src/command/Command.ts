import { type APIGatewayProxyCallbackV2 } from 'aws-lambda'
import { type APIApplicationCommand, type APIApplicationCommandInteraction } from 'discord-api-types/payloads/v10'
import 'discord-api-types/rest/v10/interactions'

export interface Command {
  getMetadata: () => Partial<APIApplicationCommand>
  run: (interaction: APIApplicationCommandInteraction, callback: APIGatewayProxyCallbackV2) => Promise<any>
}

export type CommandConstructor =
  new () => Command

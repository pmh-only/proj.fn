import { type APIGatewayProxyCallbackV2, type APIGatewayProxyEventV2 } from 'aws-lambda'
import { InteractionType, type APIInteraction, InteractionResponseType, type APIInteractionResponsePong } from 'discord-api-types/payloads/v10'

import { verifyEvent } from './crypto/verify'
import { signResult } from './crypto/sign'
import { resolveCommand } from './command/resolver'

export const handler = async (
  event: APIGatewayProxyEventV2, _: unknown,
  callback: APIGatewayProxyCallbackV2): Promise<void> => {
  //
  if (event.body === undefined) {
    console.error('invalid request body')
    callback(null, signResult('invalid request body', 401))
    return
  }

  const interaction = JSON.parse(event.body) as APIInteraction
  const isVerified = await verifyEvent(event)

  if (!isVerified) {
    console.error('invalid request signature')
    callback(null, signResult('invalid request signature', 401))
    return
  }

  if (interaction.type === InteractionType.Ping) {
    callback(null, signResult<APIInteractionResponsePong>(({
      type: InteractionResponseType.Pong
    })))
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const resolvedCommand = resolveCommand(interaction.data.name)
    if (resolvedCommand === undefined) {
      console.error('invalid request command')
      callback(null, signResult('invalid request type', 400))
      return
    }

    resolvedCommand.run(interaction, callback)
  }

  console.error('invalid request type')
  callback(null, signResult('invalid request type', 400))
}

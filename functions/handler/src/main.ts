import { type APIGatewayProxyCallbackV2, type APIGatewayProxyEventV2 } from 'aws-lambda'
import { InteractionType, type APIInteraction, InteractionResponseType, type APIInteractionResponsePong, ApplicationCommandType, type APIInteractionResponseDeferredChannelMessageWithSource } from 'discord-api-types/v10'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import { verifyEvent } from './crypto/verify'
import { signResult } from './crypto/sign'

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
    callback(null, signResult<APIInteractionResponsePong>({
      type: InteractionResponseType.Pong
    }))
    return
  }

  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    const lambdaClient = new LambdaClient()
    const invokeCommand = new InvokeCommand({
      FunctionName: 'projfn-lambda-autocompleter',
      Payload: JSON.stringify(interaction)
    })

    const { Payload } = await lambdaClient.send(invokeCommand)
    const payload = JSON.parse(Payload?.transformToString() ?? '')

    callback(null, signResult(payload))
    return
  }

  if (interaction.type === InteractionType.ApplicationCommand &&
      interaction.data.type === ApplicationCommandType.ChatInput) {
    const lambdaClient = new LambdaClient()
    const invokeCommand = new InvokeCommand({
      FunctionName: 'projfn-lambda-commander',
      Payload: JSON.stringify(interaction),
      InvocationType: 'Event'
    })

    await lambdaClient.send(invokeCommand)

    callback(null, signResult<APIInteractionResponseDeferredChannelMessageWithSource>({
      type: InteractionResponseType.DeferredChannelMessageWithSource
    }))
  }
}

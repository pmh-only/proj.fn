import './init'

import { type APIGatewayProxyCallbackV2, type APIGatewayProxyEventV2 } from 'aws-lambda'
import { InteractionType, type APIInteraction, InteractionResponseType, type APIInteractionResponsePong, type APIInteractionResponseChannelMessageWithSource, ApplicationCommandType, type APIChatInputApplicationCommandGuildInteraction, ApplicationCommandOptionType, type APIApplicationCommandInteractionDataStringOption, type APIApplicationCommandAutocompleteResponse } from 'discord-api-types/payloads/v10'

import { verifyEvent } from './crypto/verify'
import { signResult } from './crypto/sign'
import { resolveCommand } from './command/resolver'
import { resolveAutocompleter } from './autocompleter/resolver'

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

  if (interaction.type === InteractionType.ApplicationCommand && interaction.data.type === ApplicationCommandType.ChatInput) {
    if (interaction.guild_id === undefined) {
      callback(null, signResult<APIInteractionResponseChannelMessageWithSource>({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'This service only works on Servers, not DM.'
        }
      }))
      return
    }

    const resolvedCommand = resolveCommand(interaction.data.name)
    if (resolvedCommand === undefined) {
      console.error('invalid request command')
      callback(null, signResult('invalid request type', 400))
      return
    }

    await resolvedCommand.run(interaction as APIChatInputApplicationCommandGuildInteraction, callback)
      .catch((err: Error) => {
        console.error(err)
        callback(null, signResult<APIInteractionResponseChannelMessageWithSource>({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Error: ${err.name}: ${err.message}\`\`\`${err.stack}\`\`\``
          }
        }))
      })

    return
  }

  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    const stringOptions = interaction.data.options.filter((v) => v.type === ApplicationCommandOptionType.String) as APIApplicationCommandInteractionDataStringOption[]
    const focusedStringOption = stringOptions.find((v) => v.focused === true)

    if (focusedStringOption === undefined) {
      console.error('None of the options is focused.')
      callback(null, signResult('invalid request type', 400))
      return
    }

    const resolvedAutocompleter = resolveAutocompleter(focusedStringOption.name)
    if (resolvedAutocompleter === undefined) {
      console.error('invalid request autocompleter')
      callback(null, signResult('invalid request autocompleter', 400))
      return
    }

    await resolvedAutocompleter.run(interaction, callback)
      .catch((err: Error) => {
        console.error(err)
        callback(null, signResult<APIApplicationCommandAutocompleteResponse>({
          type: InteractionResponseType.ApplicationCommandAutocompleteResult,
          data: {
            choices: []
          }
        }))
      })

    return
  }

  console.error('invalid request type')
  callback(null, signResult('invalid request type', 400))
}

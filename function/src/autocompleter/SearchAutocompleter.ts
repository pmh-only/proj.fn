import { type APIGatewayProxyCallbackV2 } from 'aws-lambda'
import { type APIApplicationCommandAutocompleteResponse, type APIApplicationCommandAutocompleteInteraction, InteractionResponseType, type APIApplicationCommandInteractionDataStringOption, type APIApplicationCommandOptionChoice } from 'discord-api-types/v10'
import ytsr, { type Video } from 'ytsr'
import { type Autocompleter } from './Autocompleter'
import { signResult } from '../crypto/sign'

export class SearchAutocompleter implements Autocompleter {
  public run = async (interaction: APIApplicationCommandAutocompleteInteraction, callback: APIGatewayProxyCallbackV2): Promise<void> => {
    const searchQuery = (interaction.data.options.find((v) => v.name === 'search') as APIApplicationCommandInteractionDataStringOption).value.trim()
    if (searchQuery === '') {
      callback(null, signResult<APIApplicationCommandAutocompleteResponse>({
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices: []
        }
      }))

      return
    }

    const searchResult = await ytsr(searchQuery, {
      limit: 10,
      gl: 'ko'
    })

    const choices: APIApplicationCommandOptionChoice[] = (searchResult
      .items
      .filter((v) => v.type === 'video') as Video[])
      .filter((v) => !v.isLive && !v.isUpcoming)
      .slice(0, 10)
      .map((v) => ({
        name: `${v.title} -- ${v.author?.name ?? 'unknown'} (${v.duration}) (${v.uploadedAt})`.slice(0, 100),
        value: v.id
      }))

    callback(null, signResult<APIApplicationCommandAutocompleteResponse>({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices
      }
    }))
  }
}

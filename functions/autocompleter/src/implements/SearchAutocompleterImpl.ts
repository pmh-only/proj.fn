import { type APIApplicationCommandAutocompleteInteraction, type APIApplicationCommandInteractionDataStringOption, type APIApplicationCommandOptionChoice } from 'discord-api-types/v10'
import ytsr, { type Video } from 'ytsr'
import { type Autocompleter } from '../Autocompleter'

export class SearchAutocompleterImpl implements Autocompleter {
  public run = async (interaction: APIApplicationCommandAutocompleteInteraction): Promise<APIApplicationCommandOptionChoice[]> => {
    const searchQuery = (interaction.data.options
      .find((v) => v.name === 'search') as APIApplicationCommandInteractionDataStringOption)
      .value.trim()

    if (searchQuery === '') {
      return []
    }

    const searchResult = await ytsr(searchQuery, {
      limit: 10,
      gl: 'ko'
    }).catch(() => ({ items: [] }))

    const choices = (searchResult
      .items
      .filter((v) => v.type === 'video') as Video[])
      .filter((v) => !v.isLive && !v.isUpcoming)
      .slice(0, 10)
      .map((v) => ({
        name: `${v.title} -- ${v.author?.name ?? 'unknown'} (${v.duration}) (${v.uploadedAt})`.slice(0, 100),
        value: v.id
      }))

    return choices
  }
}

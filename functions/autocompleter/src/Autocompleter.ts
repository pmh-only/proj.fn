import { type APIApplicationCommandOptionChoice, type APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10'

export interface Autocompleter {
  run: (interaction: APIApplicationCommandAutocompleteInteraction) => Promise<APIApplicationCommandOptionChoice[]>
}

export type AutocompleterConstructor =
  new () => Autocompleter

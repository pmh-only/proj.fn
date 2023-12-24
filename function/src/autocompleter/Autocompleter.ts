import { type APIGatewayProxyCallbackV2 } from 'aws-lambda'
import { type APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10'

export interface Autocompleter {
  run: (interaction: APIApplicationCommandAutocompleteInteraction, callback: APIGatewayProxyCallbackV2) => Promise<void>
}

export type AutocompleterConstructor =
  new () => Autocompleter

import { type Callback } from 'aws-lambda'
import { ApplicationCommandOptionType, type APIApplicationCommandAutocompleteInteraction, type APIApplicationCommandInteractionDataStringOption, InteractionResponseType } from 'discord-api-types/v10'
import { resolveAutocompleter } from './resolver'

export const handler = async (
  event: APIApplicationCommandAutocompleteInteraction, _: unknown,
  callback: Callback): Promise<void> => {
  //
  const stringOptions = event.data.options.filter((v) => v.type === ApplicationCommandOptionType.String) as APIApplicationCommandInteractionDataStringOption[]
  const focusedStringOption = stringOptions.find((v) => v.focused === true)

  if (focusedStringOption === undefined) {
    console.error('None of the options is focused.')
    callback(null, 'invalid request type')
    return
  }

  const resolvedAutocompleter = resolveAutocompleter(focusedStringOption.name)
  if (resolvedAutocompleter === undefined) {
    console.error('invalid request autocompleter')
    callback(null, 'invalid request autocompleter')
    return
  }

  const choices = await resolvedAutocompleter.run(event)
    .catch(() => ([]))

  callback(null, ({
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: {
      choices
    }
  }))
}

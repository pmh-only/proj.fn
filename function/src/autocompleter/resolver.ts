import { type Autocompleter, type AutocompleterConstructor } from './Autocompleter'
import { SearchAutocompleter } from './SearchAutocompleter'

const autocompleters: Record<string, AutocompleterConstructor> = {
  search: SearchAutocompleter
}
export const resolveAutocompleter = (name: string): Autocompleter | undefined =>
  autocompleters[name] === undefined ? undefined : new autocompleters[name]()

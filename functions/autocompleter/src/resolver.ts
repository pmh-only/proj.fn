import { type Autocompleter, type AutocompleterConstructor } from './Autocompleter'
import { SearchAutocompleterImpl } from './implements/SearchAutocompleterImpl'

const autocompleters: Record<string, AutocompleterConstructor> = {
  search: SearchAutocompleterImpl
}
export const resolveAutocompleter = (name: string): Autocompleter | undefined =>
  autocompleters[name] === undefined ? undefined : new autocompleters[name]()

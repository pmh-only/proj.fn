import { type APIApplicationCommand, type APIChatInputApplicationCommandGuildInteraction } from 'discord-api-types/v10'

export interface Command {
  getMetadata: () => Partial<APIApplicationCommand>
  run: (interaction: APIChatInputApplicationCommandGuildInteraction) => Promise<void>
}

export type CommandConstructor =
  new () => Command

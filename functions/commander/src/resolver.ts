import { type CommandConstructor, type Command } from './Command'
import { PingCommand } from './implements/PingCommand'
import { PlayCommand } from './implements/PlayCommand'
import { QueueListCommand } from './implements/QueueListCommand'
import { SkipCommand } from './implements/SkipCommand'

const commands: Record<string, CommandConstructor> = {
  ping: PingCommand,
  queue: QueueListCommand,
  play: PlayCommand,
  skip: SkipCommand
}

export const resolveCommand = (name: string): Command | undefined =>
  commands[name] === undefined ? undefined : new commands[name]()

export const resolveAllCommands = (): Command[] =>
  Object.values(commands).map((V) => new V())

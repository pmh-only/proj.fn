import { type CommandConstructor, type Command } from './Command'
import { PingCommand } from './PingCommand'
import { PlayCommand } from './PlayCommand'
import { QueueListCommand } from './QueueListCommand'

const commands: Record<string, CommandConstructor> = {
  ping: PingCommand,
  queue: QueueListCommand,
  play: PlayCommand
}

export const resolveCommand = (name: string): Command | undefined =>
  commands[name] === undefined ? undefined : new commands[name]()

export const resolveAllCommands = (): Command[] =>
  Object.values(commands).map((V) => new V())

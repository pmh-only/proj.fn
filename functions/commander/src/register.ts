import { RouteBases, Routes } from 'discord-api-types/v10'
import { resolveAllCommands } from './resolver'

const [,, DISCORD_APPLICATION_ID, DISCORD_BOT_TOKEN] = process.argv

if (require.main !== module) {
  console.error('This module, application command registration util, doesn\'t support manual importing.')
  process.exit(-1)
}

if (DISCORD_APPLICATION_ID === undefined || DISCORD_BOT_TOKEN === undefined) {
  console.error('npm run regist_command <application_id> <bot_token>')
  process.exit(-1)
}

const commands = resolveAllCommands()
  .map((v) => v.getMetadata())

void fetch(RouteBases.api + Routes.applicationCommands(DISCORD_APPLICATION_ID), {
  method: 'PUT',
  headers: {
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(commands)
}).then(async (res) => await res.json())
  .then(console.log)
  .catch(console.error)

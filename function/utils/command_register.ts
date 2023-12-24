import { fetch } from 'undici'
import { readFile, writeFile } from 'fs/promises'

import { resolveAllCommands } from '../src/command/resolver'

if (require.main !== module) {
  console.error('This module, application command registration util, doesn\'t support manual importing.')
  process.exit(-1)
}

void (async () => {
  const savedMetadataCollection =
    await readFile('dist/metadataCollection_saved.json')
      .then((res) => res.toString('utf-8'))
      .catch(() => '{}')

  const metadataCollection =
    JSON.stringify(
      resolveAllCommands()
        .map((v) => v.getMetadata()))

  if (savedMetadataCollection === metadataCollection) {
    console.log('Current metadata collection is the same as saved one. skip.')
    return
  }

  const {
    DISCORD_APPLICATION_ID = '',
    DISCORD_BOT_TOKEN = '',
    TARGET_GUILD_ID = 'global'
  } = process.env

  const endpointUrl =
    `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}` +
    (TARGET_GUILD_ID !== 'global' ? `/guilds/${TARGET_GUILD_ID}` : '') +
    '/commands'

  const res = await fetch(endpointUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: metadataCollection
  })

  if (res.status !== 200) {
    console.error(await res.json())
  }

  if (res.status === 200) {
    await writeFile('dist/metadataCollection_saved.json', metadataCollection)
  }

  console.log('Application command registration... ' +
    (res.status === 200 ? 'SUCCESS' : 'FAIL'))
})()

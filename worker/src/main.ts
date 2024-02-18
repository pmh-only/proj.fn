import { Client, GatewayIntentBits } from 'discord.js'
import { type INode, MoonlinkManager, type VoicePacket } from 'moonlink.js'
import { playNextQueueItem } from './player/playNextQueueItem'

const {
  DISCORD_TOKEN = '',
  GUILD_ID = '',
  MEMBER_ID = ''
} = process.env

const isEnvProperlyProvided =
  DISCORD_TOKEN !== '' ||
  GUILD_ID !== '' ||
  MEMBER_ID !== ''

if (!isEnvProperlyProvided) {
  console.error('DISCORD_TOKEN, GUILD_ID or MEMBER_ID environment variable is not provided.')
  process.exit(1)
}

const nodeMetadata: INode = {
  host: 'lavalink',
  port: 2333,
  secure: true,
  password: 'password'
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
})

const moon = new MoonlinkManager([nodeMetadata], {},
  (guild: string, sPayload: string) =>
    client.guilds.cache.get(guild)?.shard.send(JSON.parse(sPayload)))

client.once('ready', async (client) => {
  moon.init(client.user.id)
})

moon.on('nodeCreate', () => {
  void (async () => {
    const targetGuild = await client.guilds.fetch(GUILD_ID)
    const targetMember = await targetGuild.members.fetch(MEMBER_ID)
    const targetChannel = targetMember.voice.channelId

    console.log('targetChannel', targetChannel)

    if (targetChannel === null) {
      void client.destroy()
      return
    }

    const player = moon.players.create({
      guildId: GUILD_ID,
      voiceChannel: targetChannel,
      textChannel: targetChannel,
      autoPlay: false
    })

    console.log('player created')
    void playNextQueueItem(moon, player)
  })()
})

moon.on('trackEnd', (player) => {
  void playNextQueueItem(moon, player)
})

client.on('raw', (data: VoicePacket) => {
  moon.packetUpdate(data)
})

void client.login(DISCORD_TOKEN)

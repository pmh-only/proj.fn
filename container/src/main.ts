import { Client, GatewayIntentBits } from 'discord.js'
import { type INode, MoonlinkManager, type VoicePacket } from 'moonlink.js'
import { playNextQueueItem } from './player/playNextQueueItem'

const {
  DISCORD_TOKEN = '',
  GUILD_ID = '',
  CHANNEL_ID = ''
} = process.env

const isEnvProperlyProvided =
  DISCORD_TOKEN !== '' ||
  GUILD_ID !== '' ||
  CHANNEL_ID !== ''

if (!isEnvProperlyProvided) {
  console.error('DISCORD_TOKEN, GUILD_ID or CHANNEL_ID environment variable is not provided.')
  process.exit(1)
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
})

const nodeMetadata: INode = {
  host: 'lavalink',
  port: 2333,
  secure: true,
  password: 'password'
}

const moon = new MoonlinkManager([nodeMetadata], {},
  (guild: string, sPayload: string) =>
    client.guilds.cache.get(guild)?.shard.send(JSON.parse(sPayload)))

moon.on('nodeCreate', () => {
  const player = moon.players.create({
    guildId: GUILD_ID,
    voiceChannel: CHANNEL_ID,
    textChannel: '',
    autoPlay: false
  })

  void playNextQueueItem(moon, player)
})

moon.on('trackEnd', (player) => {
  void playNextQueueItem(moon, player)
})

client.on('raw', (data: VoicePacket) => {
  moon.packetUpdate(data)
})

void client.login(DISCORD_TOKEN)

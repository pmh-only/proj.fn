import { ApplicationCommandType, type APIApplicationCommand, ApplicationCommandOptionType, type APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10'
import { type Command } from '../Command'
import { getBasicInfo } from 'ytdl-core'
import { addQueue } from '../queuing/addQueue'
import { checkWorkerAvailability } from '../worker/checkWorkerAvailability'
import { createWorker } from '../worker/createWorker'
import { editOriginalRespond } from '../responder/editOriginalRespond'

export class PlayCommand implements Command {
  public run = async (interaction: APIChatInputApplicationCommandInteraction): Promise<any> => {
    const videoId = interaction.data.options?.find((v) => v.name === 'search')

    if (videoId === undefined) {
      // TODO: unpause music

      const isWorkerAvailable = await checkWorkerAvailability(interaction.guild_id ?? '')
      if (!isWorkerAvailable) {
        await createWorker(interaction.guild_id ?? '', '', 'ap-northeast-2')
      }

      await editOriginalRespond(interaction.token, {
        content: 'Ready'
      })

      return
    }

    // Display search results
    if (videoId?.type === ApplicationCommandOptionType.String) {
      const { videoDetails } = await getBasicInfo(videoId.value)
        .catch(() => ({ videoDetails: undefined }))

      if (videoDetails === undefined) {
        await editOriginalRespond(interaction.token, {
          content: `The provided video id, \`${videoId.value}\` is invalid.`
        })
        return
      }

      const videoDuration = parseInt(videoDetails.lengthSeconds)

      const musicEmbed = {
        color: 0xff0000,
        title: videoDetails.title,
        url: videoDetails.video_url,
        description: (videoDetails.description?.slice(0, 100) + ((videoDetails.description?.length ?? 0) > 100 ? '...' : '')) ?? 'Empty',
        author: {
          name: videoDetails.author.name,
          url: videoDetails.author.user_url,
          icon_url: videoDetails.author.thumbnails?.[0].url
        },
        image: {
          url: videoDetails.thumbnails.sort((a, b) => a.height - b.height).reverse()[0].url
        },
        fields: [{
          name: 'Duration',
          inline: true,
          value: `${Math.floor(videoDuration / 60)}m ${videoDuration % 60}s`
        }],
        timestamp: videoDetails.uploadDate
      }

      await addQueue({
        guildId: interaction.guild_id ?? '0',
        adderId: interaction.member?.user.id ?? '',
        videoId: videoId.value,
        musicEmbed: JSON.stringify(musicEmbed),
        musicTitle: musicEmbed.title,
        musicCreator: musicEmbed.author.name,
        musicDuration: videoDuration
      })

      await editOriginalRespond(interaction.token, {
        content: 'Ready for play',
        embeds: [musicEmbed]
      })
    }
  }

  public getMetadata = (): Partial<APIApplicationCommand> => ({
    type: ApplicationCommandType.ChatInput,
    name: 'play',
    description: 'Search, play a music or unpause the music',
    options: [{
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
      name: 'search',
      description: 'Search a music to play'
    }]
  })
}

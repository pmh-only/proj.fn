import { ApplicationCommandType, type APIApplicationCommand, ApplicationCommandOptionType, type APIChatInputApplicationCommandGuildInteraction } from 'discord-api-types/v10'
import { type Command } from '../Command'
import { getBasicInfo } from 'ytdl-core'
import { addQueue } from '../queuing/addQueue'
import { checkWorkerAvailability } from '../worker/checkWorkerAvailability'
import { createWorker } from '../worker/createWorker'
import { editOriginalRespond } from '../responder/editOriginalRespond'
import ytsr, { type Video } from 'ytsr'

export class PlayCommand implements Command {
  public run = async (interaction: APIChatInputApplicationCommandGuildInteraction): Promise<any> => {
    const videoId = interaction.data.options?.find((v) => v.name === 'search')

    if (videoId === undefined) {
      const isWorkerAvailable = await checkWorkerAvailability(interaction.guild_id)
      if (!isWorkerAvailable) {
        await editOriginalRespond(interaction.token, {
          content: 'Creating a new player node...'
        })

        await createWorker(
          interaction.guild_id,
          interaction.member.user.id,
          'ap-northeast-2',
          interaction.token
        )

        await editOriginalRespond(interaction.token, {
          content: 'Waiting for the player node to come up...'
        })
        return
      }

      await editOriginalRespond(interaction.token, {
        content: 'Player node is already up state'
      })

      return
    }

    // Display search results
    if (videoId?.type === ApplicationCommandOptionType.String) {
      const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/
      if (!validPathDomains.test(videoId.value.trim())) {
        const searchResult = await ytsr(videoId.value, {
          limit: 1,
          gl: 'ko'
        }).catch(() => ({ items: [] }))

        const filteredResults = (searchResult.items
          .filter((v) => v.type === 'video') as Video[])
          .filter((v) => !v.isLive && !v.isUpcoming)

        videoId.value = filteredResults[0].url
      }

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
        author: {
          name: videoDetails.author.name,
          url: videoDetails.author.user_url,
          icon_url: videoDetails.author.thumbnails?.[0].url
        },
        image: {
          url: videoDetails.thumbnails.sort((a, b) => a.height - b.height).reverse()[0].url
        }
      }

      await addQueue({
        guildId: interaction.guild_id ?? '0',
        adderId: interaction.member?.user.id ?? '',
        videoId: videoDetails.videoId,
        musicEmbed: JSON.stringify(musicEmbed),
        musicTitle: musicEmbed.title,
        musicCreator: musicEmbed.author.name,
        musicDuration: videoDuration
      })

      const isWorkerAvailable = await checkWorkerAvailability(interaction.guild_id)
      if (!isWorkerAvailable) {
        await editOriginalRespond(interaction.token, {
          content: 'Creating a new player node...',
          embeds: [musicEmbed]
        })

        await createWorker(
          interaction.guild_id,
          interaction.member.user.id,
          'ap-northeast-2',
          interaction.token
        )

        await editOriginalRespond(interaction.token, {
          content: 'Waiting for the player node to come up...',
          embeds: [musicEmbed]
        })
        return
      }

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

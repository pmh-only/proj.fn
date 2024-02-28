import { type APIApplicationCommand, ApplicationCommandType, type APIApplicationCommandGuildInteraction } from 'discord-api-types/v10'
import { type Command } from '../Command'
import { editOriginalRespond } from '../responder/editOriginalRespond'
import { fetch } from 'undici'
import { getWorkerInfo } from '../worker/getWorkerInfo'
import { getWorker } from '../worker/getWorker'
import { getWorkerPublicIp } from '../worker/getWorkerPublicIp'

const {
  REST_API_SECRET = 'youshallnotpass',
  REST_API_PORT = '8080'
} = process.env

export class SkipCommand implements Command {
  public run = async (interaction: APIApplicationCommandGuildInteraction): Promise<any> => {
    const workerInfo = await getWorkerInfo(interaction.guild_id)
    if (workerInfo === undefined) {
      await editOriginalRespond(interaction.token, {
        content: 'Not playing or failed to skip the track. Please try again later.'
      })
      return
    }

    const worker = await getWorker(workerInfo)
    if (worker === undefined) {
      await editOriginalRespond(interaction.token, {
        content: 'Not playing or failed to skip the track. Please try again later.'
      })
      return
    }

    const workerPublicIp = await getWorkerPublicIp(workerInfo.region, worker)
    if (workerPublicIp === undefined) {
      await editOriginalRespond(interaction.token, {
        content: 'Failed to skip the track. Please try again later.'
      })
      return
    }

    const workerApiUrl = `http://${workerPublicIp}:${REST_API_PORT}/playNext`
    const res = await fetch(workerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REST_API_SECRET}`
      }
    }).then(async (res) => await res.json() as { success: boolean })

    if (res.success) {
      await editOriginalRespond(interaction.token, {
        content: 'Skipped to the next track!'
      })
    } else {
      await editOriginalRespond(interaction.token, {
        content: 'Failed to skip the track. Please try again later.'
      })
    }
  }

  public getMetadata = (): Partial<APIApplicationCommand> => ({
    name: 'skip',
    description: 'Skip to the next track in the queue',
    type: ApplicationCommandType.ChatInput
  })
}

import { type MoonlinkPlayer, type MoonlinkManager } from 'moonlink.js'
import { getNextQueueItem } from '../queuing/getNextQueueItem'
import { removeQueueItem } from '../queuing/removeQueueItem'

const {
  GUILD_ID = ''
} = process.env

export const playNextQueueItem = async (moon: MoonlinkManager, player: MoonlinkPlayer): Promise<void> => {
  const nextQueueItem = await getNextQueueItem(GUILD_ID)

  if (nextQueueItem === undefined) {
    console.error('Next queue item not found')
    player.disconnect()
    process.exit(0)
  }

  if (player.connected !== true) {
    player.connect({
      setDeaf: true,
      setMute: false
    })
  }

  const res = await moon.search(nextQueueItem.videoId)

  if (res.loadType !== 'track') {
    await removeQueueItem(nextQueueItem)
    void playNextQueueItem(moon, player)
    return
  }

  player.queue.add(res.tracks[0])

  if (player.playing !== true) {
    void player.play()
  }

  const durationUpdater = setInterval((): void => {
    clearInterval(durationUpdater)
  }, 1000)
}

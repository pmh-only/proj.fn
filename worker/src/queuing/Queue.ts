export type Queue = QueueItem[]

export interface QueueItem {
  guildId: string
  queueId: string // queue created at
  adderId: string
  videoId: string
  musicEmbed: string // in json
  musicTitle: string
  musicCreator: string
  musicDuration: number // in second
  musicCurrentTime: number // in seconds
}

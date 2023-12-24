export type Queue = QueueItem[]

export interface QueueItem {
  guildId: number
  queueId: number // queue created at
  adderId: number
  musicUrl: string
  musicTitle: string
  musicThumbnailUrl: string
  musicCreator: string
  musicDescription: string
  musicDuration: number // in seconds
  musicCurrentTime: number // in seconds
}

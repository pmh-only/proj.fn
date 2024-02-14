export type Workers = Worker[]

export interface Worker {
  guildId: string
  region: string
  taskArn: string
  workerCreatedAt: Date
}

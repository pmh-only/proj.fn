import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { type QueueItem } from './Queue'

type RequiredQueueItem = Omit<QueueItem, 'queueId' | 'musicCurrentTime'>

export const addQueue = async (queueItem: RequiredQueueItem): Promise<void> => {
  const client = new DynamoDBClient({})

  const putItemCommand = new PutItemCommand({
    TableName: 'projfn-music-queue',
    Item: {
      GuildId: {
        N: queueItem.guildId
      },
      QueueId: {
        N: Date.now().toString()
      },
      AdderId: {
        N: queueItem.adderId
      },
      VideoId: {
        S: queueItem.videoId
      },
      MusicEmbed: {
        S: queueItem.musicEmbed
      },
      MusicTitle: {
        S: queueItem.musicTitle
      },
      MusicCreator: {
        S: queueItem.musicCreator
      },
      MusicDuration: {
        N: queueItem.musicDuration.toString()
      },
      MusicCurrentTime: {
        N: '0'
      }
    }
  })

  await client.send(putItemCommand)
}

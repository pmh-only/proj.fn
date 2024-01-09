import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { type QueueItem } from './Queue'

export const updateQueueItemCurrentTime = async (queueItem: QueueItem, currentTime: number): Promise<void> => {
  const client = new DynamoDBClient({})

  const updateItemCommand = new UpdateItemCommand({
    TableName: 'projfn-music-queue',
    Key: {
      GuildId: { N: queueItem.guildId },
      QueueId: { N: queueItem.queueId }
    },
    AttributeUpdates: {
      MusicCurrentTime: {
        Value: { N: currentTime.toString() },
        Action: 'PUT'
      }
    }
  })

  await client.send(updateItemCommand)
}

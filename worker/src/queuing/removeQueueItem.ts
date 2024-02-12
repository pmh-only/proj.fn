import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type QueueItem } from './Queue'

export const removeQueueItem = async (queueItem: QueueItem): Promise<void> => {
  const client = new DynamoDBClient({})

  const deleteItemCommand = new DeleteItemCommand({
    TableName: 'projfn-music-queue',
    Key: {
      GuildId: { N: queueItem.guildId },
      QueueId: { N: queueItem.queueId }
    }
  })

  await client.send(deleteItemCommand)
}

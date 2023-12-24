import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { type Queue } from './Queue'

export const listQueue = async (guildId: string): Promise<Queue> => {
  const client = new DynamoDBClient({})

  const scanCommand = new ScanCommand({
    TableName: 'projfn-music-queue',
    FilterExpression: 'GuildId = :guildId',
    ExpressionAttributeValues: {
      ':guildId': { N: guildId }
    }
  })

  const { Items = [] } = await client.send(scanCommand)

  return Items.map((item) => ({
    guildId: parseInt(item.GuildId.N ?? '0'),
    queueId: parseInt(item.QueueId.N ?? '0'),
    adderId: parseInt(item.AdderId.N ?? '0'),
    musicUrl: item.MusicUrl.S ?? '',
    musicTitle: item.MusicTitle.S ?? '',
    musicCreator: item.MusicCreator.S ?? '',
    musicDescription: item.MusicDescription.S ?? '',
    musicThumbnailUrl: item.MusicThumbnailUrl.S ?? '',
    musicDuration: parseInt(item.MusicDuration.N ?? '0'),
    musicCurrentTime: parseInt(item.MusicCurrentTime.N ?? '0')
  }))
}

import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { type QueueItem } from './Queue'

export const getNextQueueItem = async (guildId: string): Promise<QueueItem | undefined> => {
  const client = new DynamoDBClient({})

  const queryCommand = new QueryCommand({
    TableName: 'projfn-music-queue',
    KeyConditionExpression: 'GuildId = :guildId',
    ExpressionAttributeValues: {
      ':guildId': { N: guildId }
    },
    Limit: 1
  })

  const { Items = [] } = await client.send(queryCommand)

  return Items.map((item) => ({
    guildId: item.GuildId.N ?? '0',
    queueId: item.QueueId.N ?? '0',
    adderId: item.AdderId.N ?? '0',
    videoId: item.VideoId.S ?? '',
    musicEmbed: item.MusicEmbed.S ?? '',
    musicTitle: item.MusicTitle.S ?? '',
    musicCreator: item.MusicCreator.S ?? '',
    musicDuration: parseInt(item.MusicDuration.N ?? '0'),
    musicCurrentTime: parseInt(item.MusicCurrentTime.N ?? '0')
  }))[0]
}

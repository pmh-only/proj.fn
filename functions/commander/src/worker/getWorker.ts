import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { type Worker } from './Worker'

export const getWorker = async (guildId: string): Promise<Worker | undefined> => {
  const client = new DynamoDBClient({})

  const getItemCommad = new GetItemCommand({
    TableName: 'projfn-music-workers',
    Key: {
      GuildId: { N: guildId }
    }
  })

  const { Item } = await client.send(getItemCommad)
  if (Item === undefined) {
    return undefined
  }

  return {
    guildId: Item.GuildId.N ?? '0',
    region: Item.Region.S ?? '',
    taskArn: Item.TaskARN.S ?? '',
    workerCreatedAt: new Date(Item.WorkerCreatedAt.S ?? '')
  }
}

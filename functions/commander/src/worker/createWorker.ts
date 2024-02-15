import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'
const { DISCORD_BOT_TOKEN, REGIONAL_DATA } = process.env

export const createWorker = async (guildId: string, memberId: string, region: string): Promise<void> => {
  const regionalData = JSON.parse(REGIONAL_DATA ?? '')[region]
  const ecsClient = new ECSClient({
    region
  })

  const runTaskCommand = new RunTaskCommand({
    cluster: 'projfn-cluster',
    taskDefinition: 'projfn-taskdef',
    launchType: 'FARGATE',
    overrides: {
      containerOverrides: [{
        name: 'controller',
        environment: [
          { name: 'DISCORD_TOKEN', value: DISCORD_BOT_TOKEN },
          { name: 'GUILD_ID', value: guildId },
          { name: 'MEMBER_ID', value: memberId }
        ]
      }]
    },
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: regionalData.subnets,
        securityGroups: [
          regionalData.securityGroup
        ],
        assignPublicIp: 'ENABLED'
      }
    }
  })

  const { tasks = [] } = await ecsClient.send(runTaskCommand)
  if (tasks.length < 1) {
    throw new Error('Worker task creation failed.')
  }

  const dynamodbClient = new DynamoDBClient({})
  const putItemCommand = new PutItemCommand({
    TableName: 'projfn-music-workers',
    Item: {
      GuildId: { N: guildId },
      Region: { S: region },
      TaskARN: { S: tasks[0].taskArn ?? '' },
      WorkerCreatedAt: { S: new Date().toISOString() }
    }
  })

  await dynamodbClient.send(putItemCommand)
}

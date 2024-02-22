import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'
const { DISCORD_BOT_TOKEN, REGIONAL_DATA, DISCORD_APPLICATION_ID } = process.env

export const createWorker = async (
  guildId: string,
  memberId: string,
  region: string,
  interactionToken: string
): Promise<void> => {
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
          { name: 'DISCORD_BOT_TOKEN', value: DISCORD_BOT_TOKEN },
          { name: 'DISCORD_APPLICATION_ID', value: DISCORD_APPLICATION_ID },
          { name: 'DISCORD_GUILD_ID', value: guildId },
          { name: 'DISCORD_MEMBER_ID', value: memberId },
          { name: 'DISCORD_INTERACTION_TOKEN', value: interactionToken }
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

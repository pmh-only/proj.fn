import { DescribeTasksCommand, ECSClient } from '@aws-sdk/client-ecs'
import { getWorker } from './getWorker'

export const checkWorkerAvailability = async (guildId: string): Promise<boolean> => {
  const worker = await getWorker(guildId)
  if (worker === undefined) {
    return false
  }

  const client = new ECSClient({
    region: worker.region
  })

  const describeTaskCommand = new DescribeTasksCommand({
    tasks: [
      worker.taskArn
    ]
  })

  const { tasks = [] } = await client.send(describeTaskCommand)
  const task = tasks[0]

  if (task === undefined) {
    return false
  }

  const negativeStatuses = [
    'DEACTIVATING',
    'STOPPING',
    'DEPROVISIONING',
    'STOPPED',
    'DELETED'
  ]

  if (negativeStatuses.includes(task.lastStatus ?? '')) {
    return false
  }

  return true
}

import { type Task } from '@aws-sdk/client-ecs'
import { type Worker } from './Worker'
import { DescribeTasksCommand, ECSClient } from '@aws-sdk/client-ecs'

export const getWorker = async (workerInfo: Worker): Promise<Task | undefined> => {
  const ecsClient = new ECSClient({
    region: workerInfo.region
  })

  const describeTaskCommand = new DescribeTasksCommand({
    cluster: 'projfn-cluster',
    tasks: [workerInfo.taskArn]
  })

  const { tasks = [] } = await ecsClient.send(describeTaskCommand)
  const task = tasks[0]

  if (task === undefined) {
    return undefined
  }

  const negativeStatuses = [
    'DEACTIVATING',
    'STOPPING',
    'DEPROVISIONING',
    'STOPPED',
    'DELETED'
  ]

  if (
    negativeStatuses.includes(task.lastStatus ?? '') ||
    task.desiredStatus !== 'RUNNING') {
    return undefined
  }

  return task
}

import { EC2Client, DescribeNetworkInterfacesCommand } from '@aws-sdk/client-ec2'
import { type Task } from '@aws-sdk/client-ecs'

export const getWorkerPublicIp = async (region: string, worker: Task): Promise<string | undefined> => {
  const ec2Client = new EC2Client({
    region
  })

  const networkInterfaceId = worker.attachments
    ?.find((v) => v.type === 'ElasticNetworkInterface')
    ?.details?.find((v) => v.name === 'networkInterfaceId')
    ?.value

  if (networkInterfaceId === undefined) {
    return undefined
  }

  const describeNetworkInterfaceCommand = new DescribeNetworkInterfacesCommand({
    NetworkInterfaceIds: [networkInterfaceId]
  })

  const { NetworkInterfaces } = await ec2Client.send(describeNetworkInterfaceCommand)

  return NetworkInterfaces?.[0]?.Association?.PublicIp
}

import { getWorker } from './getWorker'
import { getWorkerInfo } from './getWorkerInfo'

export const checkWorkerAvailability = async (guildId: string): Promise<boolean> => {
  const workerInfo = await getWorkerInfo(guildId)
  if (workerInfo === undefined) {
    return false
  }

  const worker = await getWorker(workerInfo)
  if (worker === undefined) {
    return false
  }

  return true
}

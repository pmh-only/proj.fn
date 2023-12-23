import { type APIGatewayProxyEventV2 } from 'aws-lambda'
import nacl from 'tweetnacl'

const { DISCORD_PUBLIC_KEY = '' } = process.env

export async function verifyEvent (event: APIGatewayProxyEventV2): Promise<boolean> {
  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']

  if (signature === undefined || timestamp === undefined) {
    return false
  }

  const textEncoder = new TextEncoder()

  const timestampData = textEncoder.encode(timestamp)
  const bodyData = textEncoder.encode(event.body)

  const messageData = new Uint8Array([...timestampData, ...bodyData])

  const signatureData =
    new Uint8Array((signature.match(/.{1,2}/g) ?? [])
      .map((byte) => parseInt(byte, 16)))

  const publicKeyData =
    new Uint8Array((DISCORD_PUBLIC_KEY.match(/.{1,2}/g) ?? [])
      .map((byte) => parseInt(byte, 16)))

  return nacl.sign.detached.verify(messageData, signatureData, publicKeyData)
}

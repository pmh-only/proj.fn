import { type APIGatewayProxyResultV2 } from 'aws-lambda'
const { DISCORD_BOT_TOKEN } = process.env

export const signResult = <T = any>(body: T, statusCode = 200): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`
  },
  body: typeof body !== 'string'
    ? JSON.stringify(body)
    : body
})

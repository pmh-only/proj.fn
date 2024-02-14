import { RouteBases, type RESTPatchAPIWebhookWithTokenMessageJSONBody, Routes } from 'discord-api-types/v10'
const {
  DISCORD_APPLICATION_ID = '',
  DISCORD_BOT_TOKEN
} = process.env

export const editOriginalRespond = async (token: string, payload: RESTPatchAPIWebhookWithTokenMessageJSONBody): Promise<void> => {
  await fetch(RouteBases.api + Routes.webhookMessage(DISCORD_APPLICATION_ID, token, '@original'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`
    },
    body: JSON.stringify(payload)
  })
}

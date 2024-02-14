import { type Callback } from 'aws-lambda'
import { type APIChatInputApplicationCommandGuildInteraction, type APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10'
import { resolveCommand } from './resolver'
import { editOriginalRespond } from './responder/editOriginalRespond'

export const handler = async (
  event: APIChatInputApplicationCommandInteraction, _: unknown,
  callback: Callback): Promise<void> => {
  //

  callback(null, null)

  if (event.guild_id === undefined) {
    await editOriginalRespond(event.token, {
      embeds: [{
        color: 0xff0000,
        title: 'Command forbidden in DM.',
        description: 'Please use it only in servers'
      }]
    })
    return
  }

  const resolvedCommand = resolveCommand(event.data.name)

  if (resolvedCommand === undefined) {
    await editOriginalRespond(event.token, {
      embeds: [{
        color: 0xff0000,
        title: 'Unknown interaction.',
        description: 'Please wait a moment and retry.'
      }]
    })
    return
  }

  const error = await resolvedCommand.run(event as APIChatInputApplicationCommandGuildInteraction)
    .catch((error: Error) => error)

  if (error === undefined) {
    return
  }

  console.error(error)

  await editOriginalRespond(event.token, {
    embeds: [{
      color: 0xff0000,
      title: 'Error has been occurred.',
      description: `**${error.name}**\`\`\`${error.message}\`\`\``
    }]
  })
}

package bot

import (
	"github.com/disgoorg/disgo/discord"
	"github.com/pmh-only/proj.fn/worker/env"
)

func (b Bot) respond(content discord.MessageUpdate) {
	if env.DISCORD_INTERACTION_TOKEN == nil {
		return
	}

	b.client.Rest().UpdateInteractionResponse(
		env.DISCORD_APPLICATION_ID,
		*env.DISCORD_INTERACTION_TOKEN,
		content,
	)
}

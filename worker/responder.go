package main

import (
	"github.com/disgoorg/disgo/bot"
	"github.com/disgoorg/disgo/discord"
)

func editOriginalRespond(client bot.Client, content discord.MessageUpdate) {
	if DISCORD_INTERACTION_TOKEN == nil {
		return
	}

	client.Rest().UpdateInteractionResponse(
		DISCORD_APPLICATION_ID,
		*DISCORD_INTERACTION_TOKEN,
		content,
	)
}

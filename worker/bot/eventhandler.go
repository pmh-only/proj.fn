package bot

import (
	"context"
	"log"

	"github.com/disgoorg/disgo/discord"
	"github.com/disgoorg/disgo/events"
	"github.com/disgoorg/disgolink/v3/disgolink"
	"github.com/disgoorg/disgolink/v3/lavalink"
	"github.com/pmh-only/proj.fn/worker/env"
)

func (b Bot) onReady(event *events.Ready) {
	b.client = event.Client()

	log.Printf("Application \"%s\" ready to serve",
		event.User.Username)

	b.respond(
		discord.NewMessageUpdateBuilder().
			SetContent("Node controller connected. Waiting for player ready...").
			Build(),
	)
}

func (b Bot) onGuildsReady(event *events.GuildsReady) {
	b.client = event.Client()

	b.retrieveTargetChannel()
	b.initPlayer()
	b.playNext()
}

func (b Bot) onVoiceStateUpdate(event *events.GuildVoiceStateUpdate) {
	if event.VoiceState.UserID != env.DISCORD_APPLICATION_ID {
		return
	}

	b.lavalink.OnVoiceStateUpdate(
		context.TODO(),
		event.VoiceState.GuildID,
		event.VoiceState.ChannelID,
		event.VoiceState.SessionID)
}

func (b Bot) onVoiceServerUpdate(event *events.VoiceServerUpdate) {
	b.lavalink.OnVoiceServerUpdate(
		context.TODO(),
		event.GuildID,
		event.Token,
		*event.Endpoint)
}

func (b Bot) onTrackEndEvent(player disgolink.Player, event lavalink.TrackEndEvent) {
	b.lavalink = player.Lavalink()
	b.player = player

	b.db.RemoveNextQueueItem()
	b.playNext()
}

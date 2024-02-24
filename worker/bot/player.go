package bot

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/disgoorg/disgo/discord"
	"github.com/disgoorg/disgolink/v3/lavalink"
	"github.com/pmh-only/proj.fn/worker/env"
)

func (b *Bot) retrieveTargetChannel() {
	voiceState, ok := b.client.Caches().VoiceState(
		env.DISCORD_GUILD_ID,
		env.DISCORD_MEMBER_ID,
	)

	if !ok || voiceState.ChannelID == nil {
		log.Fatalln("Couldn't find target channel.")
		return
	}

	b.targetChannelId = voiceState.ChannelID
	log.Printf("Target channel found: %s\n", voiceState.ChannelID.String())
}

func (b *Bot) initPlayer() {
	b.player = b.lavalink.Player(env.DISCORD_GUILD_ID)

	err := b.client.UpdateVoiceState(
		context.TODO(),
		env.DISCORD_GUILD_ID,
		b.targetChannelId,
		false, true,
	)

	if err != nil {
		log.Fatalln("Player not joinable")
		return
	}

	log.Println("Player loaded.")
}

func (b Bot) stopPlayer() {
	err := b.client.UpdateVoiceState(
		context.TODO(),
		env.DISCORD_GUILD_ID,
		nil, false, false)

	if err != nil {
		log.Fatalf("Error while disconnecting: `%s`", err)
	}
}

func (b Bot) playNext() {
	b.respond(
		discord.NewMessageUpdateBuilder().
			SetContent("Tuning...").
			Build(),
	)

	queueItem, ok := b.db.GetNextQueueItem()
	if ok && queueItem == nil {
		b.respond(
			discord.NewMessageUpdateBuilder().
				SetContent("Player finished all queues!").
				Build(),
		)

		log.Println("Worker finished all queues")
		b.stopPlayer()
		os.Exit(0)
	}

	var track lavalink.Track

	if ok {
		track, ok = b.loadTrack(*queueItem)
	}

	if ok {
		ok = b.playTrack(track)
	}

	if ok {
		var embed discord.Embed
		json.Unmarshal([]byte(queueItem.MusicEmbed), &embed)

		b.respond(
			discord.NewMessageUpdateBuilder().
				SetContent("Now playing...").
				AddEmbeds(embed).
				Build(),
		)
	}

	if !ok {
		b.db.RemoveNextQueueItem()
		b.playNext()
	}
}

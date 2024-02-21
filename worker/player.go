package main

import (
	"context"
	"log"

	"github.com/disgoorg/disgolink/v3/disgolink"
	"github.com/disgoorg/disgolink/v3/lavalink"
	"github.com/disgoorg/snowflake/v2"
)

var DISCORD_TARGET_CHANNEL_ID *snowflake.ID
var lavalinkPlayer disgolink.Player

func retrieveTargetChannel() {
	voiceState, ok := client.Caches().VoiceState(
		DISCORD_GUILD_ID,
		DISCORD_MEMBER_ID,
	)

	if ok && voiceState.ChannelID != nil {
		DISCORD_TARGET_CHANNEL_ID = voiceState.ChannelID
		log.Printf("Target channel found: %s\n", voiceState.ChannelID.String())
		return
	}

	log.Fatalln("Couldn't find target channel.")
}

func initPlayer() {
	lavalinkPlayer = lavalinkClient.Player(DISCORD_GUILD_ID)

	err := client.UpdateVoiceState(
		context.TODO(),
		DISCORD_GUILD_ID,
		DISCORD_TARGET_CHANNEL_ID,
		false, true,
	)

	if err != nil {
		log.Fatalln("Player not joinable")
		return
	}

	log.Println("Player loaded.")
}

func loadTrack(queueItem QueueItem) (result lavalink.Track, ok bool) {
	lavalinkClient.BestNode().LoadTracksHandler(
		context.TODO(),
		queueItem.VideoId,
		disgolink.NewResultHandler(
			func(track lavalink.Track) {
				result = track
				ok = true
			},
			func(playlist lavalink.Playlist) {
			},
			func(tracks []lavalink.Track) {
			},
			func() {
				ok = false
			},
			func(err error) {
				ok = false
				log.Println(err)
			},
		),
	)

	return
}

func playTrack(track lavalink.Track) (ok bool) {
	err := lavalinkPlayer.Update(context.TODO(), lavalink.WithTrack(track))
	if err != nil {
		log.Println(err)
	}

	return err == nil
}

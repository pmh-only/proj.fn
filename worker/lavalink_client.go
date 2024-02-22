package main

import (
	"context"
	"log"

	"github.com/disgoorg/disgo/events"
	"github.com/disgoorg/disgolink/v3/disgolink"
)

var lavalinkClient disgolink.Client = disgolink.New(DISCORD_APPLICATION_ID)

func connectLavalinkNode() {
	_, err := lavalinkClient.AddNode(context.TODO(), disgolink.NodeConfig{
		Name:      "lavalink",
		Address:   LAVALINK_CONNECTION_URL,
		Password:  "password",
		Secure:    false,
		SessionID: "",
	})

	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Lavalink node has been connected")
}

func onVoiceStateUpdate(event *events.GuildVoiceStateUpdate) {
	if event.VoiceState.UserID != DISCORD_APPLICATION_ID {
		return
	}

	lavalinkClient.OnVoiceStateUpdate(
		context.TODO(),
		event.VoiceState.GuildID,
		event.VoiceState.ChannelID,
		event.VoiceState.SessionID)
}

func onVoiceServerUpdate(event *events.VoiceServerUpdate) {
	lavalinkClient.OnVoiceServerUpdate(
		context.TODO(),
		event.GuildID,
		event.Token,
		*event.Endpoint)
}

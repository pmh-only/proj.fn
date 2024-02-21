package main

import (
	"context"
	"log"

	"github.com/disgoorg/disgo"
	"github.com/disgoorg/disgo/bot"
	"github.com/disgoorg/disgo/cache"
	"github.com/disgoorg/disgo/events"
	"github.com/disgoorg/disgo/gateway"
)

var client bot.Client = initClient()

func initClient() bot.Client {
	client, err := disgo.New(DISCORD_BOT_TOKEN,
		bot.WithGatewayConfigOpts(
			gateway.WithIntents(
				gateway.IntentGuilds,
			),
		),
		bot.WithCacheConfigOpts(
			cache.WithCaches(cache.FlagVoiceStates),
		),
		bot.WithEventListenerFunc(onReady),
		bot.WithEventListenerFunc(onVoiceStateUpdate),
		bot.WithEventListenerFunc(onVoiceServerUpdate),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return client
}

func openClientGateway() {
	if err := client.OpenGateway(context.TODO()); err != nil {
		log.Fatalln(err)
	}
}

func onReady(event *events.Ready) {
	log.Printf("Application \"%s\" ready to serve",
		event.User.Username)
}

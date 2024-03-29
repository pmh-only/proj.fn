package bot

import (
	"context"
	"log"

	"github.com/disgoorg/disgo"
	"github.com/disgoorg/disgo/bot"
	"github.com/disgoorg/disgo/cache"
	"github.com/disgoorg/disgo/gateway"
	"github.com/disgoorg/disgolink/v3/disgolink"
	"github.com/disgoorg/snowflake/v2"
	"github.com/pmh-only/proj.fn/worker/db"
	"github.com/pmh-only/proj.fn/worker/env"
)

type Bot struct {
	client          bot.Client
	lavalink        disgolink.Client
	targetChannelId *snowflake.ID
	db              db.DB
}

func New() *Bot {
	return new(Bot)
}

func (b Bot) Init() {
	b.initDB()
	b.initClient()
	b.initLavalink()

	b.loadEvents()
	b.loadRestHandler()

	b.connectLavalink()
	b.openGateway()
	b.restListenAndServe()
}

func (b *Bot) initClient() {
	client, err := disgo.New(env.DISCORD_BOT_TOKEN,
		bot.WithGatewayConfigOpts(
			gateway.WithIntents(
				gateway.IntentGuilds,
				gateway.IntentGuildVoiceStates,
			),
		),
		bot.WithCacheConfigOpts(
			cache.WithCaches(cache.FlagVoiceStates),
		),
	)

	if err != nil {
		log.Fatalln(err)
	}

	b.client = client
}

func (b *Bot) initLavalink() {
	b.lavalink = disgolink.New(env.DISCORD_APPLICATION_ID)

	log.Println("Discord client initialized")
}

func (b *Bot) initDB() {
	b.db = db.New()
	log.Println("DynamoDB client initialized")
}

func (b Bot) openGateway() {
	err := b.client.OpenGateway(context.TODO())
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Discord client initialized")
}

func (b Bot) connectLavalink() {
	_, err := b.lavalink.AddNode(context.TODO(), disgolink.NodeConfig{
		Name:      "lavalink",
		Address:   env.LAVALINK_CONNECTION_URL,
		Password:  env.LAVALINK_PASSWORD,
		Secure:    false,
		SessionID: "",
	})

	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Lavalink node has been connected")
}

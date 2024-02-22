package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/disgoorg/disgo/bot"
	"github.com/disgoorg/disgo/events"
	"github.com/disgoorg/disgolink/v3/disgolink"
	"github.com/disgoorg/disgolink/v3/lavalink"
)

func main() {
	openClientGateway()

	client.AddEventListeners(bot.NewListenerFunc(func(event *events.GuildsReady) {
		retrieveTargetChannel()
		connectLavalinkNode()
		initPlayer()
		playNext()
	}))

	lavalinkClient.AddListeners(disgolink.NewListenerFunc(func(player disgolink.Player, event lavalink.TrackEndEvent) {
		removeNextQueueItem()
		playNext()
	}))

	s := make(chan os.Signal, 1)
	signal.Notify(s, syscall.SIGINT, syscall.SIGTERM)
	<-s
}

func playNext() {
	queueItem, ok := getNextQueueItem()
	if ok && queueItem == nil {
		log.Println("Worker finished all queues")
		stopPlayer()
		os.Exit(0)
	}

	var track lavalink.Track

	if ok {
		track, ok = loadTrack(*queueItem)
	}

	if ok {
		ok = playTrack(track)
	}

	if !ok {
		removeNextQueueItem()
		playNext()
	}
}

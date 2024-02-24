package bot

import (
	"context"
	"log"

	"github.com/disgoorg/disgolink/v3/disgolink"
	"github.com/disgoorg/disgolink/v3/lavalink"
	"github.com/pmh-only/proj.fn/worker/db"
)

func (b Bot) loadTrack(queueItem db.QueueItem) (result lavalink.Track, ok bool) {
	b.lavalink.BestNode().LoadTracksHandler(
		context.TODO(),
		"https://www.youtube.com/watch?v="+queueItem.VideoId,
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

func (b Bot) playTrack(track lavalink.Track) (ok bool) {
	err := b.player.Update(context.TODO(), lavalink.WithTrack(track))
	if err != nil {
		log.Println(err)
	}

	return err == nil
}

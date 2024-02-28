package bot

import "net/http"

func (b Bot) onSkipRequest(w http.ResponseWriter, r *http.Request) {
	b.db.RemoveNextQueueItem()
	b.playNext()
	w.Write([]byte("{\"success\":true}"))
}

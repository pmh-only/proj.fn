package bot

import "net/http"

func (b Bot) onPlayNextRequest(w http.ResponseWriter, r *http.Request) {
	b.playNext()
	w.Write([]byte("{\"success\":true}"))
}

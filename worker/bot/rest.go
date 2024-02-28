package bot

import (
	"log"
	"net/http"

	"github.com/pmh-only/proj.fn/worker/env"
)

func (b Bot) loadRestHandler() {
	http.HandleFunc("/skip", b.blockUnauthorized(b.onSkipRequest))
}

func (b Bot) restListenAndServe() {
	log.Fatalln(http.ListenAndServe(env.REST_API_PORT, nil))
}

func (b Bot) blockUnauthorized(handler func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != env.REST_API_SECRET {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{\"success\":false,\"error\":\"unauthorized\"}"))
			return
		}

		handler(w, r)
	}
}

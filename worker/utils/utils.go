package utils

import (
	"os"
	"os/signal"
	"syscall"
)

func WaitForSignals() {
	s := make(chan os.Signal, 1)
	signal.Notify(s, syscall.SIGINT, syscall.SIGTERM)
	<-s
}

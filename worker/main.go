package main

import (
	"github.com/pmh-only/proj.fn/worker/bot"
	"github.com/pmh-only/proj.fn/worker/utils"
)

func main() {
	worker_bot := bot.New()
	worker_bot.Init()

	utils.WaitForSignals()
}

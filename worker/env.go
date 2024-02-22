package main

import (
	"log"
	"os"

	"github.com/disgoorg/snowflake/v2"
)

var DISCORD_BOT_TOKEN string = mustLoadEnv("DISCORD_BOT_TOKEN")

var DISCORD_APPLICATION_ID snowflake.ID = snowflake.MustParse(mustLoadEnv("DISCORD_APPLICATION_ID"))

var DISCORD_GUILD_ID snowflake.ID = snowflake.MustParse(mustLoadEnv("DISCORD_GUILD_ID"))

var DISCORD_MEMBER_ID snowflake.ID = snowflake.MustParse(mustLoadEnv("DISCORD_MEMBER_ID"))

var DISCORD_INTERACTION_TOKEN *string = loadEnvOptional("DISCORD_INTERACTION_TOKEN")

var LAVALINK_CONNECTION_URL string = loadEnv("LAVALINK_CONNECTION_URL", "127.0.0.1:2333")

// ---

func mustLoadEnv(env_name string) string {
	if env_value, ok := os.LookupEnv(env_name); ok {
		return env_value
	}

	log.Fatalf(
		"Important environment variable: \"%s\" not provided.\n",
		env_name)

	return ""
}

func loadEnvOptional(env_name string) *string {
	if env_value, ok := os.LookupEnv(env_name); ok {
		return &env_value
	}

	return nil
}

func loadEnv(env_name string, defaults string) string {
	if env_value, ok := os.LookupEnv(env_name); ok {
		return env_value
	}

	return defaults
}

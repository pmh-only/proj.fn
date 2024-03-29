variable "discord_bot_token" {
  description = "Discord Application Bot Token"
  
  type = string
  nullable = false
  sensitive = true
}

variable "discord_application_id" {
  description = "Discord Application ID"
  
  type = string
  nullable = false
  sensitive = false
}

variable "discord_public_key" {
  description = "Discord Application Public Key"
  
  type = string
  nullable = false
  sensitive = false
}

variable "discord_target_guild_id" {
  description = "Target Discord Guild Id (defaults to global)"

  type = string
  default = "global"
  nullable = false
}

variable "lavalink_password" {
  description = "The password for the lavalink server"
  type = string
  sensitive = true
}

variable "rest_api_secret" {
  description = "The secret for the rest api"
  type = string
  sensitive = true
}

data "aws_caller_identity" "current" {}

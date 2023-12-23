variable "discord_bot_token" {
  description = "Discord Application Bot Token"
  
  type = string
  nullable = false
  sensitive = true
}

variable "discord_public_key" {
  description = "Discord Application Public Key"
  
  type = string
  nullable = false
  sensitive = true
}

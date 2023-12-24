resource "terraform_data" "lambda_dependency_resolve" {
  triggers_replace = timestamp()
  
  provisioner "local-exec" {
    working_dir = "../function"
    command = "npm run build"
  }
}

data "archive_file" "main" {
  type = "zip"
  source_file = "../function/dist/main.mjs"
  output_path = "../function/dist/dist.zip"

  depends_on = [
    terraform_data.lambda_dependency_resolve
  ]
}

resource "terraform_data" "lambda_command_regist" {
  triggers_replace = timestamp()
  
  provisioner "local-exec" {
    working_dir = "../function"
    command = "npm run command_regist"
    environment = {
      DISCORD_APPLICATION_ID = var.discord_application_id
      DISCORD_BOT_TOKEN = nonsensitive(var.discord_bot_token)
      TARGET_GUILD_ID = var.discord_target_guild_id
    }
  }
}


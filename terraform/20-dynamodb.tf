resource "aws_dynamodb_table" "queue" {
  name = "projfn-music-queue"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "GuildId"
  range_key = "QueueId"

  attribute {
    name = "GuildId"
    type = "N"
  }

  attribute {
    name = "QueueId"
    type = "N"
  }

  lifecycle {
    ignore_changes = [
      replica,
      stream_enabled
    ]
  }
}

resource "aws_dynamodb_table" "workers" {
  name = "projfn-music-workers"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "GuildId"

  attribute {
    name = "GuildId"
    type = "N"
  }

  lifecycle {
    ignore_changes = [
      replica,
      stream_enabled
    ]
  }
}

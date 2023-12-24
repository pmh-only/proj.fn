resource "aws_dynamodb_table" "queue" {
  provider = aws.california

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
    ignore_changes = [replica]
  }
}

resource "aws_dynamodb_table_replica" "queue" {
  provider = aws.seoul
  global_table_arn = aws_dynamodb_table.queue.arn
}

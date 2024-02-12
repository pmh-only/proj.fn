resource "aws_dynamodb_table_replica" "queue" {
  global_table_arn = var.dynamodb_table_queue_arn
}


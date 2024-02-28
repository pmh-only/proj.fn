variable "dynamodb_table_queue_arn" {
  type = string
}

variable "iam_role_task_arn" {
  type = string
}

variable "iam_role_taskexec_arn" {
  type = string
}

variable "lavalink_password" {
  type = string
}

variable "rest_api_secret" {
  type = string
}

data "aws_caller_identity" "caller" {
}

data "aws_region" "current" {
}

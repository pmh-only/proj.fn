resource "aws_cloudwatch_log_group" "worker" {
  name = "/ecs/projfn-worker"
  retention_in_days = 7
}

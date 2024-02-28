// --- ap-northeast-2 ---

provider "aws" {
  alias = "ap-northeast-2"
  region = "ap-northeast-2"
}

module "worker-ap-northeast-2" {
  source = "./worker"
  dynamodb_table_queue_arn = aws_dynamodb_table.queue.arn
  iam_role_task_arn = aws_iam_role.task.arn
  iam_role_taskexec_arn = aws_iam_role.taskexec.arn
  lavalink_password = var.lavalink_password
  rest_api_secret = var.rest_api_secret
  providers = {
    aws = aws.ap-northeast-2
  }
}

// --- ---

locals {
  regional_data = jsonencode({
    ap-northeast-2 = {
      subnets = module.worker-ap-northeast-2.subnet_ids
      securityGroup = module.worker-ap-northeast-2.security_group_id
    }
  })
}

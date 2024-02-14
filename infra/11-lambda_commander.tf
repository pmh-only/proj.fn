data "aws_iam_policy_document" "lambda_assume_role_commander" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_commander" {
  name = "projfn-role-lambda-commander"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_commander.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]
}

resource "aws_iam_role_policy" "lambda_commander" {
  name = "projfn-policy-lambda-commander"
  role = aws_iam_role.lambda_commander.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query"
        ]
        Effect   = "Allow"
        Resource = [
          aws_dynamodb_table.queue.arn,
          aws_dynamodb_table.workers.arn
        ]
      },
      {
        Action = [
          "ecs:RunTask"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:ecs:*:${data.aws_caller_identity.current.account_id}:task-definition/projfn-taskdef"
        ]
      },
      {
        Action = [
          "iam:PassRole"
        ]
        Effect = "Allow"
        Resource = [
          aws_iam_role.task.arn,
          aws_iam_role.taskexec.arn
        ]
      }
    ]
  })
}



resource "aws_lambda_function" "commander" {
  filename = data.archive_file.commander.output_path
  source_code_hash = data.archive_file.commander.output_base64sha256

  function_name = "projfn-lambda-commander"
  role = aws_iam_role.lambda_commander.arn
  handler = "main.handler"
  runtime = "nodejs18.x"
  timeout = 60
  memory_size = 128

  environment {
    variables = {
      DISCORD_APPLICATION_ID = var.discord_application_id
      DISCORD_BOT_TOKEN = var.discord_bot_token
    }
  }
}

// ---

resource "terraform_data" "lambda_commander" {
  triggers_replace = timestamp()
  
  provisioner "local-exec" {
    working_dir = "../functions/commander"
    command = "npm run build"
  }
}

data "archive_file" "commander" {
  type = "zip"
  source_dir = "../functions/commander/dist/"
  output_path = "../functions/commander/dist/dist.zip"
  excludes = ["dist.zip"]

  depends_on = [
    terraform_data.lambda_commander
  ]
}

data "aws_iam_policy_document" "lambda_assume_role" {
  provider = aws.california

  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda" {
  name = "projfn-role-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]
}

resource "aws_iam_role_policy" "lambda" {
  name = "projfn-policy-lambda"
  role = aws_iam_role.lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.queue.arn
      }
    ]
  })
}

resource "aws_lambda_function" "main" {
  provider = aws.california
  filename = data.archive_file.main.output_path
  source_code_hash = data.archive_file.main.output_base64sha256

  function_name = "projfn-lambda"
  role = aws_iam_role.lambda.arn
  handler = "main.handler"
  runtime = "nodejs20.x"
  timeout = 60
  memory_size = 512

  environment {
    variables = {
      DISCORD_BOT_TOKEN = var.discord_bot_token
      DISCORD_PUBLIC_KEY = var.discord_public_key
    }
  }
}

resource "aws_lambda_permission" "apigw" {
  provider = aws.california
  function_name = aws_lambda_function.main.function_name
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"

  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
}

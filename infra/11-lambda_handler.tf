data "aws_iam_policy_document" "lambda_assume_role_handler" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_handler" {
  name = "projfn-role-lambda-handler"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_handler.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]
}

resource "aws_iam_role_policy" "lambda_handler" {
  name = "projfn-policy-lambda-handler"
  role = aws_iam_role.lambda_handler.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "lambda:InvokeFunction"
        ]
        Effect   = "Allow"
        Resource = [
          aws_lambda_function.autocompleter.arn,
          aws_lambda_function.commander.arn
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "handler" {
  filename = data.archive_file.handler.output_path
  source_code_hash = data.archive_file.handler.output_base64sha256

  function_name = "projfn-lambda-handler"
  role = aws_iam_role.lambda_handler.arn
  handler = "main.handler"
  runtime = "nodejs18.x"
  timeout = 60
  memory_size = 128

  environment {
    variables = {
      DISCORD_BOT_TOKEN = var.discord_bot_token
      DISCORD_PUBLIC_KEY = var.discord_public_key
      DISCORD_APPLICATION_ID = var.discord_application_id
    }
  }
}

resource "aws_lambda_permission" "apigw" {
  function_name = aws_lambda_function.handler.function_name
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"

  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
}

// ---

resource "terraform_data" "lambda_handler" {
  triggers_replace = timestamp()
  
  provisioner "local-exec" {
    working_dir = "../functions/handler"
    command = "npm run build"
  }
}

data "archive_file" "handler" {
  type = "zip"
  source_dir = "../functions/handler/dist/"
  output_path = "../functions/handler/dist/dist.zip"
  excludes = ["dist.zip"]

  depends_on = [
    terraform_data.lambda_handler
  ]
}

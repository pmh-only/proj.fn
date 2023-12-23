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

resource "terraform_data" "lambda_dependency_resolve" {
  triggers_replace = timestamp()
  
  provisioner "local-exec" {
    working_dir = "../function"
    command = "npm run build"
  }
}

data "archive_file" "main" {
  type = "zip"
  source_file = "../function/main.mjs"
  output_path = "../function/dist.zip"

  depends_on = [
    terraform_data.lambda_dependency_resolve
  ]
}

resource "aws_lambda_function" "main" {
  provider = aws.california
  filename = data.archive_file.main.output_path
  source_code_hash = data.archive_file.main.output_base64sha256

  function_name = "projfn-lambda"
  role = aws_iam_role.lambda.arn
  handler = "main.handler"
  runtime = "nodejs20.x"
}

resource "aws_lambda_permission" "apigw" {
  provider = aws.california
  function_name = aws_lambda_function.main.function_name
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"

  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
}

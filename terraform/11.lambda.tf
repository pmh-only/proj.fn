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

data "archive_file" "main" {
  type = "zip"
  source_dir = "../function"
  output_path = "../dist/function.zip"
}

resource "aws_lambda_function" "main" {
  provider = aws.california
  filename = data.archive_file.main.output_path
  source_code_hash = data.archive_file.main.output_base64sha256

  function_name = "projfn-lambda"
  role = aws_iam_role.lambda.arn
  handler = "main.handler"
  runtime = "nodejs16.x"
}

resource "aws_lambda_permission" "apigw" {
  provider = aws.california
  function_name = aws_lambda_function.main.function_name
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"

  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
}

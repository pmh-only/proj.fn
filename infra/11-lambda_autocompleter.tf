data "aws_iam_policy_document" "lambda_assume_role_autocompleter" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_autocompleter" {
  name = "projfn-role-lambda-autocompleter"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_autocompleter.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]
}

resource "aws_lambda_function" "autocompleter" {
  filename = data.archive_file.autocompleter.output_path
  source_code_hash = data.archive_file.autocompleter.output_base64sha256

  function_name = "projfn-lambda-autocompleter"
  role = aws_iam_role.lambda_autocompleter.arn
  handler = "main.handler"
  runtime = "nodejs18.x"
  timeout = 60
  memory_size = 256
}

// ---

resource "terraform_data" "lambda_autocompleter" {
  triggers_replace = timestamp()
  
  provisioner "local-exec" {
    working_dir = "../functions/autocompleter"
    command = "npm run build"
  }
}

data "archive_file" "autocompleter" {
  type = "zip"
  source_dir = "../functions/autocompleter/dist/"
  output_path = "../functions/autocompleter/dist/dist.zip"
  excludes = ["dist.zip"]

  depends_on = [
    terraform_data.lambda_autocompleter
  ]
}

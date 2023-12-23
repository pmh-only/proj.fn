resource "aws_apigatewayv2_api" "main" {
  provider = aws.california

  name = "projfn-apigw"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "main" {
  provider = aws.california
  api_id = aws_apigatewayv2_api.main.id

  name = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_route" "main" {
  provider = aws.california
  api_id = aws_apigatewayv2_api.main.id

  route_key = "$default"
  target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_integration" "main" {
  provider = aws.california
  api_id = aws_apigatewayv2_api.main.id

  integration_type = "AWS_PROXY"
  integration_uri = aws_lambda_function.main.invoke_arn
}

output "projfn-apigw-endpoint" {
  value = aws_apigatewayv2_api.main.api_endpoint
}

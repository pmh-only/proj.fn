output "projfn-endpoint" {
  value = "${aws_apigatewayv2_api.main.api_endpoint}/endpoint"
}

output "projfn-ecr-access-id" {
  value = aws_iam_access_key.ecr.id
}

output "projfn-ecr-secret-key" {
  value = aws_iam_access_key.ecr.secret
  sensitive = true
}

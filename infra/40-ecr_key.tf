resource "aws_iam_user" "ecr" {
  name = "projfn-user-ecr"
}

resource "aws_iam_user_policy" "ecr" {
  name = "projfn-policy-ecr"
  user = aws_iam_user.ecr.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:CompleteLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:ecr:*:${data.aws_caller_identity.current.account_id}:repository/projfn-worker-controller",
          "arn:aws:ecr:*:${data.aws_caller_identity.current.account_id}:repository/projfn-worker-nodelink"
        ]
      },
      {
          "Effect": "Allow",
          "Action": "ecr:GetAuthorizationToken",
          "Resource": "*"
      }
    ]
  })
}

resource "aws_iam_access_key" "ecr" {
  user = aws_iam_user.ecr.name
}

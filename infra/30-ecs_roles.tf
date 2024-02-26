data "aws_iam_policy_document" "taskexec_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "taskexec" {
  name = "projfn-role-taskexec"
  assume_role_policy = data.aws_iam_policy_document.taskexec_assume_role.json
}

resource "aws_iam_role_policy" "taskexec" {
  name = "projfn-policy-taskexec"
  role = aws_iam_role.taskexec.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:logs:*:${data.aws_caller_identity.current.account_id}:log-group:/ecs/projfn-worker:log-stream:*"
        ]
      },
      {
        Action = [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer"
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

data "aws_iam_policy_document" "task_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "task" {
  name = "projfn-role-task"
  assume_role_policy = data.aws_iam_policy_document.task_assume_role.json
}

resource "aws_iam_role_policy" "task" {
  name = "projfn-policy-task"
  role = aws_iam_role.task.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:DeleteItem"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:dynamodb:*:${data.aws_caller_identity.current.account_id}:table/projfn-music-queue"
        ]
      }
    ]
  })
}

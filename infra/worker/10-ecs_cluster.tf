resource "aws_ecs_cluster" "main" {
  name = "projfn-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "taskdef" {
  family = "projfn-taskdef"
  cpu = "256"
  memory = "512"
  network_mode = "awsvpc"
  task_role_arn = var.iam_role_task_arn
  execution_role_arn = var.iam_role_taskexec_arn
  container_definitions = jsonencode([
    { // controller
      name = "controller",
      image = "ghcr.io/pmh-only/projfn",
      essential = true,
      cpu = 128,
      memory = 100,
      memoryReservation = 100,
      portMappings = [{
        name = "controller-8080-tcp",
        hostPort = 8080,
        containerPort = 8080,
        protocol = "tcp",
        appProtocol = "http"
      }],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-create-group" = "true",
          "awslogs-group" = "/ecs/projfn-worker",
          "awslogs-region" = "ap-northeast-2",
          "awslogs-stream-prefix" = "controller"
        }
      }
    },
    { // lavalink
      name = "lavalink",
      image = "ghcr.io/pmh-only/nodelink",
      essential = true,
      cpu = 128,
      memory = 412,
      memoryReservation = 412,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-create-group" = "true",
          "awslogs-group" = "/ecs/projfn-worker",
          "awslogs-region" = "ap-northeast-2",
          "awslogs-stream-prefix" = "lavalink"
        }
      }
    }
  ])
}

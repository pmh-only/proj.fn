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
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture = "ARM64"
  }
  container_definitions = jsonencode([
    { // controller
      name = "controller",
      image = aws_ecr_repository.controller.repository_url,
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
          "awslogs-region" = data.aws_region.current.name,
          "awslogs-stream-prefix" = "controller"
        }
      }
    },
    { // lavalink
      name = "lavalink",
      image = aws_ecr_repository.nodelink.repository_url,
      essential = true,
      cpu = 128,
      memory = 412,
      memoryReservation = 412,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-create-group" = "true",
          "awslogs-group" = "/ecs/projfn-worker",
          "awslogs-region" = data.aws_region.current.name,
          "awslogs-stream-prefix" = "lavalink"
        }
      },
      environment = [
        { name = "LAVALINK_PASSWORD", value = var.lavalink_password }
      ]
    }
  ])
}

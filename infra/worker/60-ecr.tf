resource "aws_ecr_repository" "controller" {
  name = "projfn-worker-controller"
}

resource "aws_ecr_repository" "nodelink" {
  name = "projfn-worker-nodelink"
}

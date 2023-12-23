terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    archive = {
      source = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  alias = "california"
  region = "us-west-1"
}

provider "aws" {
  alias = "seoul"
  region = "ap-northeast-2"
}

provider "archive" {
}

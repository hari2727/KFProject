provider "aws" {
  region = var.region
}

terraform {
  required_providers {
    rabbitmq = {
      source = "cyrilgdn/rabbitmq"
      version = "1.8.0"
    }
  }
  backend "s3" {}
}


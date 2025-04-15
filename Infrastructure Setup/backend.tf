terraform {
  backend "s3" {
    bucket         = "mern-application-bucket"
    region         = "ap-south-1"
    key            = "eks/terraform.tfstate"
    dynamodb_table = "terraform-state-lock-mern-application"
    encrypt        = true
  }
}

resource "aws_vpc" "main_vpc" {
  cidr_block           = var.cidr_block
  instance_tenancy     = "default"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name      = var.vpc_name
    Env       = var.env
    Terraform = "true"
  }
}

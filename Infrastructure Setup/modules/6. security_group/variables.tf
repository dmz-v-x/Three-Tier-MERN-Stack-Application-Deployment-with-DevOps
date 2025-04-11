variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "security_group" {
  description = "The name of the security group"
  type        = string
}

variable "env" {
  description = "The environment name"
  type        = string
}

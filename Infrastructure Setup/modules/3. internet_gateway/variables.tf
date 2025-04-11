variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "igw_name" {
  description = "The name of the Internet Gateway"
  type        = string
}

variable "cluster_name" {
  description = "The name of the Kubernetes cluster"
  type        = string
}

variable "env" {
  description = "The environment name"
  type        = string
}

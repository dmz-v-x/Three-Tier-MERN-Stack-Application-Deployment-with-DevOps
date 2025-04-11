variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "igw_id" {
  description = "The ID of the Internet Gateway"
  type        = string
}

variable "ngw_id" {
  description = "The ID of the NAT Gateway"
  type        = string
}

variable "public_rt_name" {
  description = "The name for the public route table"
  type        = string
}

variable "private_rt_name" {
  description = "The name for the private route table"
  type        = string
}

variable "env" {
  description = "The environment name"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}
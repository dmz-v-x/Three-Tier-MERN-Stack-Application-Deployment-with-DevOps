variable "public_subnet_id" {
  description = "The ID of the public subnet"
  type        = string
}

variable "eip_name" {
  description = "The name of the Elastic IP"
  type        = string
}

variable "ngw_name" {
  description = "The name of the NAT Gateway"
  type        = string
}

variable "env" {
  description = "The environment name"
  type        = string
}

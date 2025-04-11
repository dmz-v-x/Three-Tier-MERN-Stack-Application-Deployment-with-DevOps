variable "is_eks_cluster_enabled" {
  type        = bool
  description = "Flag to enable/disable EKS cluster creation"
}

variable "cluster_name" {
  type        = string
  description = "The name of the EKS cluster"
}

variable "cluster_version" {
  type        = string
  description = "The version of the EKS cluster"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for the EKS cluster"
}

variable "endpoint_private_access" {
  type        = bool
  description = "Enable private endpoint access"
}

variable "endpoint_public_access" {
  type        = bool
  description = "Enable public endpoint access"
}

variable "security_group_ids" {
  type        = list(string)
  description = "List of security group IDs for the EKS cluster"
}

variable "env" {
  type        = string
  description = "Environment tag (e.g. dev, prod)"
}

variable "cluster_role_arn" {
  type        = string
  description = "ARN of the IAM role for the EKS cluster"
}


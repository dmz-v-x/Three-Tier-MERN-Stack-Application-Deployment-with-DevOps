variable "is_eks_role_enabled" {
  description = "Flag to enable the EKS cluster role"
  type        = bool
  default     = true
}

variable "is_eks_nodegroup_role_enabled" {
  description = "Flag to enable the EKS nodegroup role"
  type        = bool
  default     = true
}

variable "cluster_role_name" {
  description = "Name of the EKS cluster IAM role"
  type        = string
}

variable "nodegroup_role_name" {
  description = "Name of the EKS nodegroup IAM role"
  type        = string
}

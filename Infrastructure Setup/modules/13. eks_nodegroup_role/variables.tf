variable "cluster_name" {
  description = "The name of the cluster"
  type        = string
}

variable "is_eks_nodegroup_role_enabled" {
  description = "Flag to enable the EKS nodegroup role"
  type        = bool
  default     = true
}

variable "env" {
  description = "Environment name"
  type        = string
}

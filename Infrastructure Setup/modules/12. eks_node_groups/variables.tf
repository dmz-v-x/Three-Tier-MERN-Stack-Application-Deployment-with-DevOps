variable "cluster_name" {
  type        = string
  description = "The name of the EKS cluster"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for the node groups"
}

variable "desired_capacity_on_demand" {
  type        = number
  description = "Desired capacity for on-demand node group"
}

variable "min_capacity_on_demand" {
  type        = number
  description = "Min capacity for on-demand node group"
}

variable "max_capacity_on_demand" {
  type        = number
  description = "Max capacity for on-demand node group"
}

variable "ondemand_instance_types" {
  type        = list(string)
  description = "Instance types for the on-demand node group"
}

variable "desired_capacity_spot" {
  type        = number
  description = "Desired capacity for spot node group"
}

variable "min_capacity_spot" {
  type        = number
  description = "Min capacity for spot node group"
}

variable "max_capacity_spot" {
  type        = number
  description = "Max capacity for spot node group"
}

variable "spot_instance_types" {
  type        = list(string)
  description = "Instance types for the spot node group"
}

variable "env" {
  type        = string
  description = "Environment name"
}

variable "disk_size" {
  type        = number
  description = "Disk size in GiB for worker nodes"
  default     = 50
}

variable "node_role_arn" {
  type        = string
  description = "ARN of the node IAM role"
}

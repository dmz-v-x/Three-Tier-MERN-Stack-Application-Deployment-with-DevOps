variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "addons" {
  description = "Map of EKS addon configurations"
  type = map(object({
    version = string
    tags    = optional(map(string))
  }))
}

variable "env" {
  description = "Environment name"
  type        = string
}

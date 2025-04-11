variable "role_name" {
  type        = string
  description = "Name of the IAM role to create"
}

variable "oidc_provider_url" {
  type        = string
  description = "URL of the OIDC provider"
}

variable "oidc_provider_arn" {
  type        = string
  description = "ARN of the OIDC provider"
}

variable "namespace" {
  type        = string
  description = "Kubernetes namespace for the service account"
  default     = "default"
}

variable "service_account" {
  type        = string
  description = "Kubernetes service account name"
}

variable "env" {
  type        = string
  description = "Environment name"
}
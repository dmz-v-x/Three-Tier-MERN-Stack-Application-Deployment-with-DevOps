variable "oidc_url" {
  type        = string
  description = "OIDC URL for the EKS cluster"
}

variable "certificate_thumbprint" {
  type        = string
  description = "SHA1 fingerprint of the certificate"
}

variable "env" {
  type        = string
  description = "Environment name"
}
variable "eks_cluster" {
  description = "The EKS cluster to fetch the certificate from"
  type = object({
    identity = list(object({
      oidc = list(object({
        issuer = string
      }))
    }))
  })
}

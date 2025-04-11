data "tls_certificate" "eks_certificate" {
  url = var.eks_cluster.identity[0].oidc[0].issuer
}
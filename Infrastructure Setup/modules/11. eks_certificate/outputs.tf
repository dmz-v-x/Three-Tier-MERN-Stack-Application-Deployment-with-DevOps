output "eks_certificate_url" {
  description = "URL of the EKS OIDC issuer"
  value       = data.tls_certificate.eks_certificate.url
}

output "eks_certificate_thumbprint" {
  description = "SHA1 fingerprint of the certificate"
  value       = data.tls_certificate.eks_certificate.certificates[0].sha1_fingerprint
}
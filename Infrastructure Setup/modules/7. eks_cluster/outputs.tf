output "eks_cluster_name" {
  value = aws_eks_cluster.eks[0].name
}

output "eks_cluster_arn" {
  value = aws_eks_cluster.eks[0].arn
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.eks[0].endpoint
}

output "eks_cluster_certificate_authority" {
  value = aws_eks_cluster.eks[0].certificate_authority[0].data
}

output "cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL of the EKS cluster"
  value       = aws_eks_cluster.eks[0].identity[0].oidc[0].issuer
}

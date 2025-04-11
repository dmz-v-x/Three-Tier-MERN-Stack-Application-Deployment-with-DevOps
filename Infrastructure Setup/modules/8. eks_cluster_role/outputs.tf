output "eks_cluster_role_name" {
  description = "Name of the EKS cluster IAM role"
  value       = var.is_eks_role_enabled ? aws_iam_role.eks_cluster_role[0].name : ""
}

output "eks_cluster_role_arn" {
  description = "ARN of the EKS cluster IAM role"
  value       = var.is_eks_role_enabled ? aws_iam_role.eks_cluster_role[0].arn : ""
}

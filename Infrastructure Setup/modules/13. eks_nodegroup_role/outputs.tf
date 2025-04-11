output "eks_nodegroup_role_name" {
  description = "Name of the EKS nodegroup IAM role"
  value       = var.is_eks_nodegroup_role_enabled ? aws_iam_role.eks_nodegroup_role[0].name : null
}

output "eks_nodegroup_role_arn" {
  description = "ARN of the EKS nodegroup IAM role"
  value       = var.is_eks_nodegroup_role_enabled ? aws_iam_role.eks_nodegroup_role[0].arn : null
}

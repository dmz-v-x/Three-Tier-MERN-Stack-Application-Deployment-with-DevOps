output "eks_oidc_role_name" {
  description = "Name of the created IAM role"
  value       = aws_iam_role.eks_oidc.name
}

output "eks_oidc_role_arn" {
  description = "ARN of the created IAM role"
  value       = aws_iam_role.eks_oidc.arn
}
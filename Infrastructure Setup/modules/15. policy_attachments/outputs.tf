output "cluster_role_policy_attachments" {
  description = "List of ARNs of policies attached to the EKS cluster role"
  value       = aws_iam_role_policy_attachment.AmazonEKSClusterPolicy[*].policy_arn
}

output "nodegroup_role_policy_attachments" {
  description = "List of ARNs of policies attached to the EKS nodegroup role"
  value = distinct(concat(
    aws_iam_role_policy_attachment.eks_AmazonWorkerNodePolicy[*].policy_arn,
    aws_iam_role_policy_attachment.eks_AmazonEKS_CNI_Policy[*].policy_arn,
    aws_iam_role_policy_attachment.eks_AmazonEC2ContainerRegistryReadOnly[*].policy_arn,
    aws_iam_role_policy_attachment.eks_AmazonEBSCSIDriverPolicy[*].policy_arn
  ))
}

output "ondemand_node_group_arn" {
  description = "ARN of the on-demand node group"
  value       = aws_eks_node_group.ondemand_node.arn
}

output "spot_node_group_arn" {
  description = "ARN of the spot node group"
  value       = aws_eks_node_group.spot_node.arn
}

output "ondemand_node_group_status" {
  description = "Status of the on-demand node group"
  value       = aws_eks_node_group.ondemand_node.status
}

output "spot_node_group_status" {
  description = "Status of the spot node group"
  value       = aws_eks_node_group.spot_node.status
}

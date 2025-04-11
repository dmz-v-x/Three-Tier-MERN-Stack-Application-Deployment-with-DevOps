output "eks_addons" {
  description = "Map of EKS addon details"
  value = { for k, v in aws_eks_addon.eks_addons : v.addon_name => {
    arn           = v.arn
    addon_version = v.addon_version
  } }
}

output "eks_addon_arns" {
  description = "ARNs of the EKS addons"
  value       = [for addon in aws_eks_addon.eks_addons : addon.arn]
}

output "eks_addon_names" {
  description = "Names of the EKS addons"
  value       = [for addon in aws_eks_addon.eks_addons : addon.addon_name]
}

output "eks_addon_versions" {
  description = "Versions of the EKS addons"
  value       = { for k, v in aws_eks_addon.eks_addons : v.addon_name => v.addon_version }
}

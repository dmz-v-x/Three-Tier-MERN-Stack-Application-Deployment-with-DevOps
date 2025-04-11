resource "aws_eks_addon" "eks_addons" {
  for_each      = var.addons
  cluster_name  = var.cluster_name
  addon_name    = each.key
  addon_version = each.value.version

  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "PRESERVE"

  tags = {
    Name        = "${var.cluster_name}-${each.key}"
    Environment = var.env
    Terraform   = "true"
  }
}

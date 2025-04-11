resource "aws_eks_node_group" "ondemand_node" {
  cluster_name    = var.cluster_name
  node_group_name = "${var.cluster_name}-on-demand-nodes"
  node_role_arn   = var.node_role_arn

  scaling_config {
    desired_size = var.desired_capacity_on_demand
    min_size     = var.min_capacity_on_demand
    max_size     = var.max_capacity_on_demand
  }

  subnet_ids     = var.subnet_ids
  instance_types = var.ondemand_instance_types
  capacity_type  = "ON_DEMAND"
  disk_size      = var.disk_size

  labels = {
    type = "ondemand"
  }

  update_config {
    max_unavailable = 1
  }

  tags = {
    Name        = "${var.cluster_name}-ondemand-nodes"
    Environment = var.env
    Terraform   = "true"
    NodeType    = "ondemand"
  }
}

resource "aws_eks_node_group" "spot_node" {
  cluster_name    = var.cluster_name
  node_group_name = "${var.cluster_name}-spot-nodes"
  node_role_arn   = var.node_role_arn

  scaling_config {
    desired_size = var.desired_capacity_spot
    min_size     = var.min_capacity_spot
    max_size     = var.max_capacity_spot
  }

  subnet_ids     = var.subnet_ids
  instance_types = var.spot_instance_types
  capacity_type  = "SPOT"
  disk_size      = var.disk_size

  labels = {
    type      = "spot"
    lifecycle = "spot"
  }

  update_config {
    max_unavailable = 1
  }

  tags = {
    Name        = "${var.cluster_name}-spot-nodes"
    Environment = var.env
    Terraform   = "true"
    NodeType    = "spot"
  }
}

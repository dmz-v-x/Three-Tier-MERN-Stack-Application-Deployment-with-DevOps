# Add the random_integer resource as it's referenced but not defined
resource "random_integer" "random_suffix" {
  min = 1
  max = 99999
}

resource "aws_iam_role" "eks_nodegroup_role" {
  count = var.is_eks_nodegroup_role_enabled ? 1 : 0
  name  = "${var.cluster_name}-nodegroup-role-${random_integer.random_suffix.result}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = {
    Name        = "${var.cluster_name}-nodegroup-role"
    Environment = var.env
    Terraform   = "true"
  }
}

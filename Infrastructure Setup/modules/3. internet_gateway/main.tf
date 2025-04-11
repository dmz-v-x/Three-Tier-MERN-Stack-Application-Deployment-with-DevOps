resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = var.vpc_id

  tags = {
    Name                                        = var.igw_name
    Env                                         = var.env
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
    Terraform                                   = "true"
  }

}

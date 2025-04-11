resource "aws_iam_openid_connect_provider" "eks_oidc" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [var.certificate_thumbprint]
  url             = var.oidc_url

  tags = {
    Name      = "eks-oidc-provider"
    Env       = var.env
    Terraform = "true"
  }
}
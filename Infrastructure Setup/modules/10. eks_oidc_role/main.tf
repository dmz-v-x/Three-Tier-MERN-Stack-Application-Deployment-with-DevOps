resource "aws_iam_role" "eks_oidc" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.eks_oidc_assume_role_policy.json

  tags = {
    Name      = var.role_name
    Env       = var.env
    Terraform = "true"
  }
}

data "aws_iam_policy_document" "eks_oidc_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    condition {
      test     = "StringEquals"
      variable = "${replace(var.oidc_provider_url, "https://", "")}:sub"
      values   = ["system:serviceaccount:${var.namespace}:${var.service_account}"]
    }

    principals {
      identifiers = [var.oidc_provider_arn]
      type        = "Federated"
    }
  }
}

resource "aws_iam_policy" "eks_oidc_policy" {
  name = "eks-oidc-policy"

  policy = jsonencode({
    Statement = [
      {
        Action = [
          "s3:ListAllMyBuckets",
          "s3:GetBucketLocation"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action   = "s3:PutObject",
        Effect   = "Allow",
        Resource = "arn:aws:s3:::your-bucket-name/*"
      }
    ]
    Version = "2012-10-17"
  })
}

# Attach policy to the role
resource "aws_iam_role_policy_attachment" "eks_oidc_policy_attachment" {
  role       = aws_iam_role.eks_oidc.name
  policy_arn = aws_iam_policy.eks_oidc_policy.arn
}
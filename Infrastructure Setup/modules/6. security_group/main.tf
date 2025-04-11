resource "aws_security_group" "security_group" {
  name        = var.security_group
  description = "Allow 443 from Jump Server only"

  vpc_id = var.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = var.security_group
    Env       = var.env
    Terraform = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

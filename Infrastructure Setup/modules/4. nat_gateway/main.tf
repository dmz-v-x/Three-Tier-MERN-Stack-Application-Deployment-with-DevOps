resource "aws_eip" "elastic_ip" {
  domain = "vpc"

  tags = {
    Name      = var.eip_name
    Env       = var.env
    Terraform = "true"
  }

}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.elastic_ip.id
  subnet_id     = var.public_subnet_id

  tags = {
    Name      = var.ngw_name
    Env       = var.env
    Terraform = "true"
  }

  depends_on = [aws_eip.elastic_ip]
}

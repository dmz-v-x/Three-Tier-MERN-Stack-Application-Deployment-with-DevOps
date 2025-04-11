output "ngw_id" {
  description = "The ID of the NAT Gateway"
  value       = aws_nat_gateway.nat_gateway.id
}

output "eip_id" {
  description = "The ID of the Elastic IP"
  value       = aws_eip.elastic_ip.id
}

output "sg_id" {
  description = "The ID of the created security group"
  value       = aws_security_group.security_group.id
}

output "sg_name" {
  description = "The name of the created security group"
  value       = aws_security_group.security_group.name
}

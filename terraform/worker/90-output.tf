output "subnet_ids" {
  value = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

output "security_group_id" {
  value = aws_security_group.main.id
}

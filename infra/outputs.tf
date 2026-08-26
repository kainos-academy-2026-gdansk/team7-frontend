output "application_resource_group_name" {
  description = "Configured resource group for future application resources."
  value       = var.resource_group_name
}

output "application_location" {
  description = "Configured location for future application resources."
  value       = var.location
}

output "environment" {
  description = "Configured deployment environment."
  value       = var.environment
}

output "common_tags" {
  description = "Tags prepared for future application resources."
  value       = local.common_tags
}

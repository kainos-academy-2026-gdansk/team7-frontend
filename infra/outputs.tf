output "application_resource_group_name" {
  description = "Resource group containing the frontend Container App."
  value       = data.azurerm_resource_group.frontend.name
}

output "application_location" {
  description = "Azure region containing the frontend Container App."
  value       = data.azurerm_resource_group.frontend.location
}

output "environment" {
  description = "Configured deployment environment."
  value       = var.environment
}

output "common_tags" {
  description = "Tags applied to frontend resources."
  value       = local.common_tags
}

output "container_app_id" {
  description = "Resource ID of the public frontend Container App."
  value       = module.container_app.container_app_id
}

output "frontend_url" {
  description = "Public HTTPS URL of the latest frontend Container App revision."
  value       = "https://${module.container_app.latest_revision_fqdn}"
}

output "frontend_identity_id" {
  description = "Resource ID of the frontend user-assigned managed identity."
  value       = module.container_app.identity_id
}

output "frontend_identity_principal_id" {
  description = "Principal ID of the frontend user-assigned managed identity."
  value       = module.container_app.identity_principal_id
}

output "container_app_id" {
  description = "Resource ID of the frontend Container App."
  value       = azurerm_container_app.frontend.id
}

output "latest_revision_fqdn" {
  description = "Public FQDN of the latest frontend Container App revision."
  value       = azurerm_container_app.frontend.latest_revision_fqdn
}

output "identity_id" {
  description = "Resource ID of the frontend user-assigned managed identity."
  value       = azurerm_user_assigned_identity.frontend.id
}

output "identity_principal_id" {
  description = "Principal ID of the frontend user-assigned managed identity."
  value       = azurerm_user_assigned_identity.frontend.principal_id
}

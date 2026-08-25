output "storage_account_name" {
  description = "Storage account that will hold Terraform practice state"
  value       = azurerm_storage_account.practice.name
}

output "state_container_name" {
  description = "Blob container that will hold Terraform practice state"
  value       = azurerm_storage_container.practice.name
}

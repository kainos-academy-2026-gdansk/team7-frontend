resource "azurerm_resource_group" "main" {
  name     = var.name
  location = var.location

  tags = {
    Project     = "team7"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

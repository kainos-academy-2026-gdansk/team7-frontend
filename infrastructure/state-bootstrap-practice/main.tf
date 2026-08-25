data "azurerm_resource_group" "practice" {
  name = var.resource_group_name
}

resource "azurerm_storage_account" "practice" {
  name                            = var.storage_account_name
  resource_group_name             = data.azurerm_resource_group.practice.name
  location                        = data.azurerm_resource_group.practice.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
}

resource "azurerm_storage_container" "practice" {
  name                  = var.state_container_name
  storage_account_id    = azurerm_storage_account.practice.id
  container_access_type = "private"
}

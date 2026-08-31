locals {
  common_tags = {
    environment = var.environment
    project     = "team7-frontend"
  }
}

data "azurerm_resource_group" "frontend" {
  name = var.resource_group_name
}

data "azurerm_key_vault" "frontend" {
  name                = "team7-KV"
  resource_group_name = data.azurerm_resource_group.frontend.name
}

data "azurerm_container_app_environment" "frontend" {
  name                = "team7-cae-dev"
  resource_group_name = data.azurerm_resource_group.frontend.name
}

data "azurerm_container_registry" "frontend" {
  name                = "acraiacademy26"
  resource_group_name = "rg-ai-academy-26"
}

module "container_app" {
  source = "./modules/container-app"

  resource_group_name             = data.azurerm_resource_group.frontend.name
  location                        = data.azurerm_resource_group.frontend.location
  container_app_environment_id    = data.azurerm_container_app_environment.frontend.id
  container_registry_id           = data.azurerm_container_registry.frontend.id
  container_registry_login_server = data.azurerm_container_registry.frontend.login_server
  key_vault_id                    = data.azurerm_key_vault.frontend.id
  key_vault_uri                   = data.azurerm_key_vault.frontend.vault_uri
  container_image                 = var.container_image
  backend_api_base_url            = var.backend_api_base_url
  tags                            = local.common_tags
}

variable "resource_group_name" {
  description = "Name of the resource group containing the Container App."
  type        = string
}

variable "location" {
  description = "Azure region for the user-assigned managed identity."
  type        = string
}

variable "container_app_environment_id" {
  description = "ID of the existing Azure Container Apps Environment."
  type        = string
}

variable "container_registry_id" {
  description = "ID of the existing Azure Container Registry."
  type        = string
}

variable "container_registry_login_server" {
  description = "Login server of the existing Azure Container Registry."
  type        = string
}

variable "key_vault_id" {
  description = "ID of the existing Key Vault."
  type        = string
}

variable "key_vault_uri" {
  description = "Vault URI used to construct versionless Key Vault secret references."
  type        = string
}

variable "container_image" {
  description = "Fully qualified immutable frontend container image reference."
  type        = string
}

variable "backend_api_base_url" {
  description = "Base URL of the backend API available to the frontend container."
  type        = string
}

variable "tags" {
  description = "Tags to apply to supported Azure resources."
  type        = map(string)
}

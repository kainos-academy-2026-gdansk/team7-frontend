variable "resource_group_name" {
  description = "Name of the Azure resource group for the application."
  type        = string
  default     = "team-7"
}

variable "location" {
  description = "Azure region for future application resources."
  type        = string
  default     = "uksouth"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be dev, test, or prod."
  }
}

variable "container_image" {
  description = "Fully qualified immutable frontend container image reference."
  type        = string
}

variable "backend_api_base_url" {
  description = "Base URL of the backend API available to the frontend container."
  type        = string
}

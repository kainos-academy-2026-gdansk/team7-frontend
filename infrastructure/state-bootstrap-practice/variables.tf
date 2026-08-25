variable "resource_group_name" {
  description = "Existing resource group for Terraform practice state"
  type        = string
  default     = "rg-team7-terraform-practice"
}

variable "storage_account_name" {
  description = "Globally unique storage account name for Terraform practice state"
  type        = string
  default     = "stteam7tfpractice26"
}

variable "state_container_name" {
  description = "Private blob container for Terraform practice state"
  type        = string
  default     = "tfstate-practice"
}

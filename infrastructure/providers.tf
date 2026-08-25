terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-team7-terraform-practice"
    storage_account_name = "stteam7tfpractice26"
    container_name       = "tfstate-practice"
    key                  = "team7-practice.tfstate"
    use_azuread_auth     = true
  }
}

provider "azurerm" {
  features {}
}

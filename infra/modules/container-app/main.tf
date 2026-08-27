resource "azurerm_user_assigned_identity" "frontend" {
  name                = "team7-frontend-identity"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.tags
}

resource "azurerm_role_assignment" "acr_pull" {
  scope                = var.container_registry_id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.frontend.principal_id
}

resource "azurerm_role_assignment" "key_vault_secrets_user" {
  scope                = var.key_vault_id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.frontend.principal_id
}

locals {
  session_secret_uri = "${trimsuffix(var.key_vault_uri, "/")}/secrets/frontend-session-secret"
}

resource "azurerm_container_app" "frontend" {
  name                         = "team7-frontend"
  resource_group_name          = var.resource_group_name
  container_app_environment_id = var.container_app_environment_id
  revision_mode                = "Single"
  tags                         = var.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.frontend.id]
  }

  registry {
    server   = var.container_registry_login_server
    identity = azurerm_user_assigned_identity.frontend.id
  }

  secret {
    name                = "session-secret"
    identity            = azurerm_user_assigned_identity.frontend.id
    key_vault_secret_id = local.session_secret_uri
  }

  ingress {
    external_enabled = true
    target_port      = 4000
    transport        = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = 1
    max_replicas = 1

    container {
      name   = "frontend"
      image  = var.container_image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "4000"
      }

      env {
        name  = "API_BASE_URL"
        value = var.backend_api_base_url
      }

      env {
        name        = "SESSION_SECRET"
        secret_name = "session-secret"
      }

      liveness_probe {
        transport               = "HTTP"
        port                    = 4000
        path                    = "/health"
        interval_seconds        = 10
        timeout                 = 5
        failure_count_threshold = 3
      }

      readiness_probe {
        transport               = "HTTP"
        port                    = 4000
        path                    = "/health"
        interval_seconds        = 10
        timeout                 = 5
        failure_count_threshold = 3
      }
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.key_vault_secrets_user,
  ]
}

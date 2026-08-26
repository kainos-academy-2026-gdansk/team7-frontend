# Frontend Terraform

This Terraform root uses the existing Azure Storage remote state:

- Resource group: `team-7`
- Storage account: `team7fstate`
- Blob container: `tfstate`
- State key: `team7frontend.tfstate`

It deliberately creates no Azure resources. Its purpose is to establish the remote-state and OIDC
workflow before application hosting is added to the agreed scope.

## GitHub Actions variables

Configure these repository or `dev` environment variables without placing secrets in the repository:

- `ACR_NAME`: `acraiacademy26`
- `ACR_LOGIN_SERVER`: `acraiacademy26.azurecr.io`
- `AZURE_CLIENT_ID`: Microsoft Entra application (client) ID
- `AZURE_TENANT_ID`: Microsoft Entra tenant ID
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID

## Azure OIDC setup

An Azure administrator must create or select a Microsoft Entra application and service principal,
then add GitHub federated credentials for this repository:

- Pull request: `repo:kainos-academy-2026-gdansk/team7-frontend:pull_request`
- Main branch: `repo:kainos-academy-2026-gdansk/team7-frontend:ref:refs/heads/main`
- Development environment: `repo:kainos-academy-2026-gdansk/team7-frontend:environment:dev`

If the Azure portal presents immutable GitHub organization or repository IDs, use the subject it
generates for the matching event instead. Do not create a client secret.

## Minimum RBAC

Assign the service principal:

- `AcrPush` on `acraiacademy26`.
- `Storage Blob Data Contributor` on `team7fstate` or its `tfstate` container.
- `Reader` on the subscription only when Azure CLI discovery requires it.

No `Contributor` role is currently needed because this Terraform root creates no application
resources.

## Local validation

From the repository root, run:

```sh
git diff --check
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/cd.yml"); puts "YAML OK"'
```

From `infra/`, with Azure OIDC or equivalent Azure CLI authentication that has the RBAC above, run:

```sh
terraform fmt -check -recursive
terraform init -input=false
terraform validate
terraform plan -input=false
```

Do not run `terraform apply` locally. The protected `dev` GitHub Environment performs it only for a
push to `main`.

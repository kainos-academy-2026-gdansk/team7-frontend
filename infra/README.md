# Frontend Terraform

This Terraform root deploys the public Express frontend as an Azure Container App while using the
existing Azure resources and Azure Storage remote state:

- Resource group: `team-7`
- Key Vault: `team7-KV`
- Container Apps Environment: `team7-cae-dev`
- Azure Container Registry: `acraiacademy26` in `rg-ai-academy-26`
- Storage account: `team7fstate`
- Blob container: `tfstate`
- State key: `team7frontend.tfstate`

Terraform reads those existing resources with data sources. It creates only:

- `team7-frontend-identity` user-assigned managed identity;
- `AcrPull` and `Key Vault Secrets User` assignments for that identity;
- `team7-frontend` public Container App.

The Container App runs the immutable `team7-frontend:sha-<commit>` image on port `4000`, has
public ingress, one replica, and HTTP liveness/readiness probes on `/health`.

`SESSION_SECRET` must be created manually in `team7-KV` as `frontend-session-secret` before the
first deployment. Terraform never reads or stores its value. It passes only the versionless secret
URI to the Container App's Key Vault reference.

## GitHub Actions variables

Configure these values without placing them in the repository:

- GitHub Variables: `ACR_NAME` (`acraiacademy26`), `ACR_LOGIN_SERVER`
	(`acraiacademy26.azurecr.io`), and `BACKEND_API_BASE_URL`.
- GitHub Secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`.

Do not configure `SESSION_SECRET` as a GitHub secret or `TF_VAR_*` value.

## Azure OIDC setup

An Azure administrator must create or select a Microsoft Entra application and service principal,
then add GitHub federated credentials for this repository:

- Pull request: `repo:kainos-academy-2026-gdansk/team7-frontend:pull_request`
- Main branch: `repo:kainos-academy-2026-gdansk/team7-frontend:ref:refs/heads/main`
- Development environment: `repo:kainos-academy-2026-gdansk/team7-frontend:environment:dev`

If the Azure portal presents immutable GitHub organization or repository IDs, use the subject it
generates for the matching event instead. Do not create a client secret.

## Minimum RBAC

Assign the `team7-github-actions-frontend` Enterprise Application (object ID
`8492fcf0-e2f8-4737-a47b-f48a3a53ee80`) the following roles before the first apply:

| Role | Required scope |
| --- | --- |
| `Container Apps Contributor` | Resource group `team-7` |
| `Managed Identity Contributor` | Resource group `team-7` |
| `Managed Identity Operator` | Resource group `team-7` |
| `Key Vault Data Access Administrator` | Key Vault `team7-KV` |
| `Role Based Access Control Administrator` | ACR `acraiacademy26` only |
| `AcrPush` | ACR `acraiacademy26` |
| `Storage Blob Data Contributor` | Storage account `team7fstate` |
| `Reader` | Subscription |

`Managed Identity Contributor` does not grant `assign/action`; `Managed Identity Operator` is
therefore required. `Container Registry Contributor and Data Access Configuration Administrator`
does not grant `roleAssignments/write`; `Role Based Access Control Administrator` is therefore
required at the ACR scope.

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
terraform plan -input=false \
	-var='container_image=acraiacademy26.azurecr.io/team7-frontend:sha-<commit>' \
	-var='backend_api_base_url=https://<backend-host>'
```

Do not run `terraform apply` locally. The protected `dev` GitHub Environment performs it only for a
push to `main`, using the same uploaded `tfplan` artifact produced by the plan job.

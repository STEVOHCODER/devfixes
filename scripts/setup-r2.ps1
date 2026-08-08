param(
  [string]$Bucket = "devfixes-logs",
  [int]$RetentionDays = 7
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$corsFile = Join-Path $projectRoot "cloudflare\r2-cors.json"

if (-not (Test-Path -LiteralPath $corsFile)) {
  throw "R2 CORS policy not found at $corsFile"
}

Write-Host "Creating R2 bucket '$Bucket'..."
& npx --yes wrangler r2 bucket create $Bucket
if ($LASTEXITCODE -ne 0) {
  Write-Warning "Bucket creation did not succeed. Continuing in case '$Bucket' already exists."
}

Write-Host "Applying browser upload CORS policy..."
& npx --yes wrangler r2 bucket cors set $Bucket --file $corsFile --force
if ($LASTEXITCODE -ne 0) {
  throw "Could not apply the R2 CORS policy."
}

Write-Host "Adding automatic log expiration after $RetentionDays days..."
& npx --yes wrangler r2 bucket lifecycle add $Bucket delete-debug-logs logs/ --expire-days $RetentionDays --force
if ($LASTEXITCODE -ne 0) {
  throw "Could not add the R2 lifecycle rule."
}

Write-Host "Cloudflare R2 setup complete."

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
function Invoke-AllexNetlify {
  param([string[]]$NetlifyArgs)
  & npm exec --yes --cache .tmp-netlify-cli --package=netlify-cli@27.14.2 -- netlify @NetlifyArgs
  if ($LASTEXITCODE -ne 0) { throw 'Netlify command did not complete. Check its message before continuing.' }
}
Write-Host 'Deploy ALLEX to a temporary Netlify site. Choose your Free team; do not attach the official domain.'
if (-not (Test-Path -LiteralPath 'node_modules/.bin/vite.cmd')) {
  & npm ci
  if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
Invoke-AllexNetlify -NetlifyArgs @('login')
if (-not (Test-Path -LiteralPath '.netlify/state.json')) {
  Invoke-AllexNetlify -NetlifyArgs @('sites:create')
}
& node scripts/import-netlify-mail.mjs
if ($LASTEXITCODE -ne 0) { throw 'Configure the mail environment before publishing.' }
Invoke-AllexNetlify -NetlifyArgs @('deploy','--build','--prod')
Write-Host 'Deployment command completed. Open the returned URL and verify the contact form.'

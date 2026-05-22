# Usage: install.ps1 [project_path] [skill_name]
#   project_path  install to <project_path>\.claude\skills  (default: %USERPROFILE%\.claude\skills)
#   skill_name    install a single skill by name             (default: all)

param(
    [string]$ProjectPath = "",
    [string]$SkillName = ""
)

$SkillsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetDir = if ($ProjectPath) { "$ProjectPath\.claude\skills" } else { "$env:USERPROFILE\.claude\skills" }

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$installed = 0
Get-ChildItem -Path $SkillsDir -Directory | ForEach-Object {
    if ($SkillName -and $_.Name -ne $SkillName) { return }
    $target = Join-Path $TargetDir $_.Name
    if (Test-Path $target) { Remove-Item $target -Recurse -Force }
    Copy-Item -Path $_.FullName -Destination $target -Recurse -Force
    Write-Host "✓ $($_.Name)"
    $installed++
}

Write-Host ""
Write-Host "$installed skill(s) installed to $TargetDir"

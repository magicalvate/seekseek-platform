$DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "1/2 Installing dependencies..."
& pip install -r "$DIR\requirements.txt" --user -q 2>$null
if ($LASTEXITCODE -ne 0) {
    & pip install -r "$DIR\requirements.txt" -q
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies. Check that Python and pip are installed." -ForegroundColor Red
        exit 1
    }
}

Write-Host "2/2 Registering ec-bridge with Claude Code (user scope)..."
& claude mcp remove ec-bridge --scope user 2>$null
& claude mcp add ec-bridge --scope user `
    -e CLOUD_API_BASE=http://106.13.15.237:8199 `
    -e CLOUD_API_KEY="" `
    -- python "$DIR\server.py"

Write-Host ""
Write-Host "Done. Restart Claude Code and ask about your meetings."

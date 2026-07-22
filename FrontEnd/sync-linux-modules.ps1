$ErrorActionPreference = 'Stop'

$frontendRoot = $PSScriptRoot
$workDirectory = Join-Path $frontendRoot '._linux_modules_build'
$linuxModules = Join-Path $frontendRoot '_node_modules_linux'
$linuxArchive = Join-Path $frontendRoot '_node_modules_linux.tar.gz'
$newArchive = Join-Path $frontendRoot '_node_modules_linux.tar.gz.new'
$oldModules = Join-Path $frontendRoot '_node_modules_linux.previous'

function Remove-SafeChildDirectory {
    param([string]$Path, [string]$ExpectedName)

    if (-not (Test-Path -LiteralPath $Path)) { return }

    $resolvedRoot = [System.IO.Path]::GetFullPath($frontendRoot).TrimEnd('\')
    $resolvedPath = [System.IO.Path]::GetFullPath($Path).TrimEnd('\')
    if ([System.IO.Path]::GetDirectoryName($resolvedPath) -ne $resolvedRoot -or
        [System.IO.Path]::GetFileName($resolvedPath) -ne $ExpectedName) {
        throw "Refuz să șterg o cale neașteptată: $resolvedPath"
    }

    Remove-Item -LiteralPath $resolvedPath -Recurse -Force
}

function Convert-ToWslPath {
    param([string]$WindowsPath)

    $fullPath = [System.IO.Path]::GetFullPath($WindowsPath)
    if ($fullPath -notmatch '^([A-Za-z]):\\(.*)$') {
        throw "Calea nu este pe un disc Windows: $fullPath"
    }

    $drive = $Matches[1].ToLowerInvariant()
    $relativePath = $Matches[2].Replace('\', '/')
    return "/mnt/$drive/$relativePath"
}
if (-not (Get-Command wsl.exe -ErrorAction SilentlyContinue)) {
    throw 'WSL nu este disponibil.'
}

foreach ($requiredFile in @('package.json', 'package-lock.json')) {
    if (-not (Test-Path -LiteralPath (Join-Path $frontendRoot $requiredFile))) {
        throw "Lipsește $requiredFile din $frontendRoot"
    }
}

Remove-SafeChildDirectory $workDirectory '._linux_modules_build'
Remove-SafeChildDirectory $oldModules '_node_modules_linux.previous'
Remove-Item -LiteralPath $newArchive -Force -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Path $workDirectory | Out-Null
Copy-Item -LiteralPath (Join-Path $frontendRoot 'package.json') -Destination $workDirectory
Copy-Item -LiteralPath (Join-Path $frontendRoot 'package-lock.json') -Destination $workDirectory

try {
    $linuxWorkDirectory = Convert-ToWslPath $workDirectory
    $linuxNewArchive = Convert-ToWslPath $newArchive
    if (-not $linuxWorkDirectory -or -not $linuxNewArchive) {
        throw 'WSL nu a putut converti căile proiectului.'
    }

    Write-Host 'Instalez dependențele Linux din package-lock.json...'
    & wsl.exe bash -lic "cd '$linuxWorkDirectory' && npm_config_cache='$linuxWorkDirectory/.npm-cache' npm ci --no-audit --no-fund"
    if ($LASTEXITCODE -ne 0) {
        throw "npm ci în WSL a eșuat cu codul $LASTEXITCODE. Versiunea Linux existentă a fost păstrată."
    }

    $newModules = Join-Path $workDirectory 'node_modules'
    if (-not (Test-Path -LiteralPath $newModules)) {
        throw 'Instalarea Linux nu a produs folderul node_modules.'
    }

    Write-Host 'Creez arhiva Linux pentru transfer...'
    & wsl.exe bash -lc "tar -czf '$linuxNewArchive' -C '$linuxWorkDirectory' node_modules"
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $newArchive)) {
        throw 'Arhivarea dependențelor Linux a eșuat. Versiunea existentă a fost păstrată.'
    }

    if (Test-Path -LiteralPath $linuxModules) {
        Move-Item -LiteralPath $linuxModules -Destination $oldModules
    }

    try {
        Move-Item -LiteralPath $newModules -Destination $linuxModules
    }
    catch {
        if (Test-Path -LiteralPath $oldModules) {
            Move-Item -LiteralPath $oldModules -Destination $linuxModules
        }
        throw
    }

    Remove-SafeChildDirectory $oldModules '_node_modules_linux.previous'
    Move-Item -LiteralPath $newArchive -Destination $linuxArchive -Force

    $archiveSizeMb = [math]::Round((Get-Item -LiteralPath $linuxArchive).Length / 1MB, 1)
    Write-Host "Gata: _node_modules_linux și _node_modules_linux.tar.gz ($archiveSizeMb MB) sunt actualizate."
}
finally {
    Remove-SafeChildDirectory $workDirectory '._linux_modules_build'
    Remove-Item -LiteralPath $newArchive -Force -ErrorAction SilentlyContinue
}
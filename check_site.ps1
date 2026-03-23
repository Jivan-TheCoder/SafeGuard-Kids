# SafeGuard Website Verification Script
# This script verifies the integrity of the landing page and ensures all required features are present.

$sitePath = "d:\Home Personal\AI\Website Projects\Tracker Landing Page 1"
$indexFile = Join-Path $sitePath "index.html"
$cssFile = Join-Path $sitePath "style.css"

Write-Host "--- SafeGuard Verification ---" -ForegroundColor Cyan

# 1. Check for Core Files
if (Test-Path $indexFile) {
    Write-Host "[PASS] index.html exists." -ForegroundColor Green
} else {
    Write-Host "[FAIL] index.html missing!" -ForegroundColor Red
}

if (Test-Path $cssFile) {
    Write-Host "[PASS] style.css exists." -ForegroundColor Green
} else {
    Write-Host "[FAIL] style.css missing!" -ForegroundColor Red
}

# 2. Verify Content Keywords
$content = Get-Content $indexFile -Raw

$requiredKeywords = @(
    "WhatsApp Business",
    "Instagram Lite",
    "Stealth Mode",
    "Call Tracking",
    "Identify all Chat Contacts",
    "Upcoming updates will be shown",
    "Note:.*This app is only for child tracking"
)

foreach ($keyword in $requiredKeywords) {
    if ($content -match $keyword) {
        Write-Host "[PASS] Found keyword: '$keyword'" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Missing keyword: '$keyword'" -ForegroundColor Red
    }
}

# 3. Verify Sticky Header
$cssContent = Get-Content $cssFile -Raw
if ($cssContent -match "header\s*\{[^}]*position:\s*sticky" -and $cssContent -match "backdrop-filter:\s*blur") {
    Write-Host "[PASS] Sticky header with glassmorphism detected." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Sticky header or glassmorphism missing!" -ForegroundColor Red
}

Write-Host "--- Verification Complete ---" -ForegroundColor Cyan

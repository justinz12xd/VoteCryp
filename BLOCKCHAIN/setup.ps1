# Script de configuración para Windows PowerShell
Write-Host "🚀 Configurando VoteCryp Blockchain..." -ForegroundColor Green

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  IMPORTANTE: Edita el archivo .env con tus claves reales antes del deploy" -ForegroundColor Red
}

# Compilar contratos
Write-Host "🔨 Compilando contratos..." -ForegroundColor Yellow
npm run compile

# Ejecutar tests
Write-Host "🧪 Ejecutando tests..." -ForegroundColor Yellow
npm test

Write-Host ""
Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Edita el archivo .env con tu PRIVATE_KEY"
Write-Host "2. Para deploy local: npm run deploy"
Write-Host "3. Para deploy en Lisk Sepolia: npm run deploy:lisk"
Write-Host "4. Para deploy en Ethereum Sepolia: npm run deploy:sepolia"
Write-Host ""
Write-Host "🔗 URLs útiles:" -ForegroundColor Cyan
Write-Host "- Lisk Sepolia Explorer: https://sepolia-blockscout.lisk.com"
Write-Host "- Lisk Sepolia Faucet: https://app.optimism.io/faucet"
Write-Host "- Ethereum Sepolia Faucet: https://sepoliafaucet.com"

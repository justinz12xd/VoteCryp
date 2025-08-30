#!/bin/bash

echo "🚀 Configurando VoteCryp Blockchain..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus claves reales antes del deploy"
fi

# Compilar contratos
echo "🔨 Compilando contratos..."
npm run compile

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Edita el archivo .env con tu PRIVATE_KEY"
echo "2. Para deploy local: npm run deploy"
echo "3. Para deploy en Lisk Sepolia: npm run deploy:lisk"
echo "4. Para deploy en Ethereum Sepolia: npm run deploy:sepolia"
echo ""
echo "🔗 URLs útiles:"
echo "- Lisk Sepolia Explorer: https://sepolia-blockscout.lisk.com"
echo "- Lisk Sepolia Faucet: https://app.optimism.io/faucet"
echo "- Ethereum Sepolia Faucet: https://sepoliafaucet.com"

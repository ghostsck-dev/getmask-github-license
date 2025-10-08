#!/bin/bash

# 🚀 Script de Teste Local GetMask License System

echo "🎭 GetMask License System - Teste Local"
echo "======================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Verificar se o GitHub token está configurado
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN não configurado"
    echo "📝 Configure o token com: export GITHUB_TOKEN=seu_token"
    echo "🔗 Crie um token em: https://github.com/settings/tokens"
    echo "📋 Permissões necessárias: repo (acesso completo)"
    echo ""
    echo "🔄 Continuando sem token para teste básico..."
else
    echo "✅ GitHub token configurado"
fi

# Executar servidor
echo "🚀 Iniciando servidor na porta 3000..."
echo "🌐 Acesse: http://localhost:3000"
echo "📱 API: http://localhost:3000/api/companies"
echo ""
echo "⏹️  Para parar: Ctrl+C"
echo ""

node github-license-server.js

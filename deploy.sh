#!/bin/bash

# 🚀 Script de Deploy GetMask License System
# Este script automatiza o deploy do sistema de licenças

echo "🎭 GetMask License System - Deploy Script"
echo "========================================"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install express cors

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
    exit 1
fi

echo "✅ GitHub token configurado"

# Testar conexão com GitHub
echo "🔍 Testando conexão com GitHub..."
node -e "
const https = require('https');
const options = {
    hostname: 'api.github.com',
    path: '/user',
    headers: {
        'Authorization': 'token ' + process.env.GITHUB_TOKEN,
        'User-Agent': 'GetMask-Deploy-Script'
    }
};

const req = https.request(options, (res) => {
    if (res.statusCode === 200) {
        console.log('✅ Conexão com GitHub OK');
        process.exit(0);
    } else {
        console.log('❌ Erro na conexão com GitHub:', res.statusCode);
        process.exit(1);
    }
});

req.on('error', (err) => {
    console.log('❌ Erro de conexão:', err.message);
    process.exit(1);
});

req.end();
"

if [ $? -eq 0 ]; then
    echo "✅ Conexão com GitHub verificada"
else
    echo "❌ Falha na verificação do GitHub"
    exit 1
fi

# Opções de deploy
echo ""
echo "🚀 Escolha uma opção de deploy:"
echo "1) Heroku (Recomendado)"
echo "2) Railway.app"
echo "3) Render.com"
echo "4) Executar localmente"
echo "5) Sair"

read -p "Digite sua escolha (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploy no Heroku..."
        
        # Verificar se o Heroku CLI está instalado
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI não encontrado"
            echo "📥 Instale em: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        # Criar app Heroku
        echo "📱 Criando app Heroku..."
        heroku create getmask-github-license
        
        # Configurar variáveis
        echo "🔧 Configurando variáveis..."
        heroku config:set GITHUB_TOKEN=$GITHUB_TOKEN
        
        # Deploy
        echo "🚀 Fazendo deploy..."
        git add .
        git commit -m "Deploy GetMask License System"
        git push heroku main
        
        echo "✅ Deploy concluído!"
        echo "🌐 URL: https://getmask-github-license.herokuapp.com"
        ;;
        
    2)
        echo "🚂 Deploy no Railway.app..."
        echo "📝 Instruções:"
        echo "1. Acesse: https://railway.app"
        echo "2. Conecte seu repositório GitHub"
        echo "3. Configure a variável GITHUB_TOKEN"
        echo "4. Deploy automático será iniciado"
        ;;
        
    3)
        echo "🎨 Deploy no Render.com..."
        echo "📝 Instruções:"
        echo "1. Acesse: https://render.com"
        echo "2. Conecte seu repositório GitHub"
        echo "3. Configure a variável GITHUB_TOKEN"
        echo "4. Deploy automático será iniciado"
        ;;
        
    4)
        echo "🏠 Executando localmente..."
        echo "🚀 Iniciando servidor na porta 3000..."
        node github-license-server.js
        ;;
        
    5)
        echo "👋 Saindo..."
        exit 0
        ;;
        
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Teste a API: curl https://seu-app.herokuapp.com/api/companies"
echo "2. Configure a interface web no GitHub Pages"
echo "3. Atualize a URL no GetMask app"
echo ""
echo "📞 Suporte:"
echo "📱 Instagram: @patricksck"
echo "🐙 GitHub: ghostsck"
echo "📧 Email: patrickgold02@outlook.com"

#!/usr/bin/env node

/**
 * Script para criar repositório GitHub e fazer deploy
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const GITHUB_USERNAME = 'ghostsck-dev';
const REPO_NAME = 'getmask-github-license';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

if (!GITHUB_TOKEN) {
    console.log('❌ GITHUB_TOKEN não configurado');
    console.log('📝 Configure com: export GITHUB_TOKEN=seu_token');
    console.log('🔗 Crie um token em: https://github.com/settings/tokens');
    process.exit(1);
}

// Criar repositório
function createRepository() {
    const data = JSON.stringify({
        name: REPO_NAME,
        description: 'GetMask License System using GitHub API',
        private: false,
        auto_init: true
    });

    const options = {
        hostname: 'api.github.com',
        path: '/user/repos',
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'GetMask-Deploy-Script',
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        
        res.on('end', () => {
            if (res.statusCode === 201) {
                console.log('✅ Repositório criado com sucesso!');
                console.log('🔗 URL:', `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`);
                console.log('📁 Clone URL:', `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`);
                
                // Fazer push dos arquivos
                pushFiles();
            } else {
                console.log('❌ Erro ao criar repositório:', res.statusCode);
                console.log('📄 Resposta:', responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Erro na requisição:', error.message);
    });

    req.write(data);
    req.end();
}

// Fazer push dos arquivos
function pushFiles() {
    console.log('📤 Fazendo push dos arquivos...');
    
    // Comandos git
    const commands = [
        'git add .',
        'git commit -m "Initial commit - GetMask License System"',
        `git push -u origin master`
    ];
    
    console.log('📋 Execute os seguintes comandos:');
    commands.forEach(cmd => console.log(`   ${cmd}`));
    
    console.log('');
    console.log('🚀 Após o push, você pode fazer deploy em:');
    console.log('   • Heroku: https://dashboard.heroku.com/new');
    console.log('   • Railway: https://railway.app');
    console.log('   • Render: https://render.com');
    console.log('');
    console.log('🔑 Configure a variável GITHUB_TOKEN no serviço escolhido');
}

// Executar
console.log('🎭 GetMask License System - Deploy Script');
console.log('=========================================');
console.log('👤 Usuário:', GITHUB_USERNAME);
console.log('📁 Repositório:', REPO_NAME);
console.log('🔑 Token:', GITHUB_TOKEN ? '✅ Configurado' : '❌ Não configurado');
console.log('');

if (GITHUB_TOKEN) {
    createRepository();
} else {
    console.log('❌ Token GitHub necessário para criar repositório');
}

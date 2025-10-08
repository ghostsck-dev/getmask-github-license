#!/usr/bin/env node

/**
 * Script para criar repositório GitHub automaticamente
 */

const https = require('https');

// Configuração
const GITHUB_USERNAME = 'ghostsck-dev';
const REPO_NAME = 'getmask-github-license';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

if (!GITHUB_TOKEN) {
    console.log('❌ GITHUB_TOKEN não configurado');
    console.log('📝 Configure com: export GITHUB_TOKEN=seu_token');
    console.log('🔗 Crie um token em: https://github.com/settings/tokens');
    console.log('');
    console.log('📋 Passos manuais:');
    console.log('1. Acesse: https://github.com/new');
    console.log('2. Repository name: getmask-github-license');
    console.log('3. Description: GetMask License System using GitHub API');
    console.log('4. Public + Initialize with README');
    console.log('5. Create repository');
    process.exit(1);
}

// Criar repositório
function createRepository() {
    const data = JSON.stringify({
        name: REPO_NAME,
        description: 'GetMask License System using GitHub API',
        private: false,
        auto_init: true,
        gitignore_template: 'Node'
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
                console.log('');
                console.log('📋 Próximos passos:');
                console.log('1. Clone o repositório');
                console.log('2. Copie os arquivos do projeto');
                console.log('3. Commit e push');
                console.log('4. Deploy no Render.com');
                
                // Executar comandos de upload
                uploadFiles();
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

// Comandos para upload dos arquivos
function uploadFiles() {
    console.log('');
    console.log('📤 Comandos para upload dos arquivos:');
    console.log('');
    console.log('```bash');
    console.log('# Clone o repositório');
    console.log(`git clone https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`);
    console.log(`cd ${REPO_NAME}`);
    console.log('');
    console.log('# Copie TODOS os arquivos de mascara_olt/server/');
    console.log('# (github-license-server.js, package.json, render.yaml, etc.)');
    console.log('');
    console.log('# Commit e push');
    console.log('git add .');
    console.log('git commit -m "Add GetMask License System for Render.com"');
    console.log('git push origin main');
    console.log('```');
    console.log('');
    console.log('🚀 Após o push, você pode fazer deploy no Render.com');
}

// Executar
console.log('🎭 GetMask License System - Criar Repositório GitHub');
console.log('==================================================');
console.log('👤 Usuário:', GITHUB_USERNAME);
console.log('📁 Repositório:', REPO_NAME);
console.log('🔑 Token:', GITHUB_TOKEN ? '✅ Configurado' : '❌ Não configurado');
console.log('');

if (GITHUB_TOKEN) {
    createRepository();
} else {
    console.log('❌ Token GitHub necessário para criar repositório');
}

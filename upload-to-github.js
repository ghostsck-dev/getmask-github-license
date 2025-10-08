#!/usr/bin/env node

/**
 * Script para upload automático dos arquivos para GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'ghostsck-dev';
const REPO_NAME = 'getmask-github-license';
const REPO_URL = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;

console.log('🎭 GetMask License System - Upload para GitHub');
console.log('=============================================');
console.log('📁 Repositório:', REPO_URL);
console.log('');

try {
    // Verificar se o repositório já existe localmente
    if (fs.existsSync(REPO_NAME)) {
        console.log('📁 Repositório já existe localmente');
        console.log('🔄 Atualizando...');
        process.chdir(REPO_NAME);
        execSync('git pull origin main', { stdio: 'inherit' });
    } else {
        console.log('📥 Clonando repositório...');
        execSync(`git clone ${REPO_URL}`, { stdio: 'inherit' });
        process.chdir(REPO_NAME);
    }

    console.log('📋 Copiando arquivos...');
    
    // Lista de arquivos para copiar
    const filesToCopy = [
        'github-license-server.js',
        'package.json',
        'render.yaml',
        'README.md',
        'RENDER_DEPLOY.md',
        'CONFIG.md',
        'test-local.js',
        'test-local.sh',
        'create-github-repo.js',
        'create-repo.js'
    ];

    // Copiar arquivos do diretório pai
    const sourceDir = path.join('..', 'mascara_olt', 'server');
    
    filesToCopy.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = file;
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`✅ Copiado: ${file}`);
        } else {
            console.log(`⚠️  Não encontrado: ${file}`);
        }
    });

    console.log('');
    console.log('📤 Fazendo commit e push...');
    
    // Adicionar todos os arquivos
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit
    execSync('git commit -m "Add GetMask License System for Render.com"', { stdio: 'inherit' });
    
    // Push
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Upload concluído com sucesso!');
    console.log('🔗 Repositório:', `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`);
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('1. Acesse: https://dashboard.render.com');
    console.log('2. New + > Web Service');
    console.log('3. Connect GitHub > Selecione o repositório');
    console.log('4. Configure e deploy');
    
} catch (error) {
    console.error('❌ Erro durante o upload:', error.message);
    console.log('');
    console.log('📋 Upload manual:');
    console.log('1. Clone o repositório manualmente');
    console.log('2. Copie os arquivos');
    console.log('3. Commit e push');
}

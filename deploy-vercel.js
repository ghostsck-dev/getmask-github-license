const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando deploy para Vercel + MongoDB Atlas...\n');

// 1. Atualizar server-mongodb.js → server.js
try {
    const serverContent = fs.readFileSync('server-mongodb.js', 'utf8');
    fs.writeFileSync('server.js', serverContent);
    console.log('✅ Atualizado: server-mongodb.js → server.js');
} catch (error) {
    console.log('❌ Erro ao atualizar server.js:', error.message);
}

// 2. Atualizar package.json para Vercel
try {
    const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    packageContent.main = 'server.js';
    packageContent.scripts.start = 'node server.js';
    packageContent.scripts.dev = 'nodemon server.js';
    
    fs.writeFileSync('package.json', JSON.stringify(packageContent, null, 2));
    console.log('✅ Atualizado: package.json para Vercel');
} catch (error) {
    console.log('❌ Erro ao atualizar package.json:', error.message);
}

// 3. Verificar se vercel.json existe
if (fs.existsSync('vercel.json')) {
    console.log('✅ Arquivo vercel.json encontrado');
} else {
    console.log('❌ Arquivo vercel.json não encontrado');
}

console.log('\n🎉 Deploy para Vercel preparado!');
console.log('\n📋 Próximos passos:');
console.log('1. Execute: npm install');
console.log('2. Teste local: node server.js');
console.log('3. Faça commit e push para GitHub');
console.log('4. Conecte o repositório ao Vercel');
console.log('5. Configure as variáveis de ambiente no Vercel');

console.log('\n🍃 MongoDB Atlas:');
console.log('URL: mongodb+srv://ghostsck:1502%40Ghost0@clustermsk.rz7l7ke.mongodb.net/getmask-licenses');
console.log('Database: getmask-licenses');
console.log('Collection: companies');

console.log('\n🌐 Vercel:');
console.log('URL: https://getmask-github-license.vercel.app (após deploy)');
console.log('Deploy: Automático do GitHub');
console.log('Logs: Disponíveis no dashboard do Vercel');

const fs = require('fs');
const path = require('path');

console.log('🍃 Preparando deploy com MongoDB Atlas...\n');

// Arquivos para o deploy com MongoDB
const filesToUpdate = [
    {
        src: 'server-mongodb.js',
        dest: 'server.js'
    },
    {
        src: 'package-mongodb.json',
        dest: 'package.json'
    }
];

// Atualizar arquivos
filesToUpdate.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(__dirname, dest);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Atualizado: ${src} → ${dest}`);
    } else {
        console.log(`⚠️ Arquivo não encontrado: ${src}`);
    }
});

// Criar arquivo .env para variáveis de ambiente
const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://getmask:getmask123@cluster0.mongodb.net/getmask-licenses?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=production

# GetMask Configuration
APP_NAME=GetMask License System
APP_VERSION=3.0.0
APP_DATABASE=MongoDB Atlas
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('✅ Arquivo .env criado');

// Atualizar render.yaml
const renderYaml = `# Render.com Configuration with MongoDB Atlas
# Build Command: npm install
# Start Command: npm start
# Environment: Node
# Node Version: 18

# Environment Variables Required:
# MONGODB_URI - MongoDB Atlas connection string
# PORT - Server port (automatically set by Render)

# Render will automatically:
# - Install dependencies with npm install
# - Start the server with npm start
# - Provide HTTPS SSL certificate
# - Set PORT environment variable
# - Enable auto-deploy from GitHub
# - Connect to MongoDB Atlas for data persistence

# MongoDB Atlas Features:
# - Real-time data persistence
# - Automatic backups
# - Scalable cloud database
# - No data loss on server restart
`;

fs.writeFileSync(path.join(__dirname, 'render.yaml'), renderYaml);
console.log('✅ render.yaml atualizado');

console.log('\n🎉 Deploy com MongoDB preparado!');
console.log('\n📋 Próximos passos:');
console.log('   1. Execute: npm install mongoose');
console.log('   2. Teste local: node setup-mongodb.js');
console.log('   3. Faça commit e push para GitHub');
console.log('   4. O Render fará deploy automático');
console.log('\n🍃 MongoDB Atlas:');
console.log('   URL: mongodb+srv://getmask:getmask123@cluster0.mongodb.net/getmask-licenses');
console.log('   Database: getmask-licenses');
console.log('   Collection: companies');
console.log('\n🌐 Servidor: https://getmask-github-license.onrender.com');

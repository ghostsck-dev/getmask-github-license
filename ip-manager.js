const axios = require('axios');

console.log('🔒 Gerenciador de IPs Autorizados - GetMask');
console.log('📋 IP Atual Autorizado: 45.181.228.226/32');
console.log('⚠️  SEGURANÇA MÁXIMA: Apenas este IP tem acesso!');
console.log('');

const SERVER_URL = 'https://getmask-github-license.onrender.com';
const ADMIN_KEY = 'getmask-admin-2025';

// Função para adicionar IP
const addIP = async (ip) => {
    try {
        const response = await axios.post(`${SERVER_URL}/api/admin/whitelist`, {
            action: 'add',
            ip: ip,
            admin_key: ADMIN_KEY
        });
        
        console.log(`✅ IP ${ip} adicionado com sucesso!`);
        console.log('📋 Lista atual:', response.data.whitelist);
    } catch (error) {
        console.error(`❌ Erro ao adicionar IP ${ip}:`, error.response?.data || error.message);
    }
};

// Função para remover IP
const removeIP = async (ip) => {
    try {
        const response = await axios.post(`${SERVER_URL}/api/admin/whitelist`, {
            action: 'remove',
            ip: ip,
            admin_key: ADMIN_KEY
        });
        
        console.log(`❌ IP ${ip} removido com sucesso!`);
        console.log('📋 Lista atual:', response.data.whitelist);
    } catch (error) {
        console.error(`❌ Erro ao remover IP ${ip}:`, error.response?.data || error.message);
    }
};

// Função para listar IPs
const listIPs = async () => {
    try {
        const response = await axios.post(`${SERVER_URL}/api/admin/whitelist`, {
            action: 'list',
            admin_key: ADMIN_KEY
        });
        
        console.log('📋 IPs autorizados:');
        response.data.whitelist.forEach((ip, index) => {
            console.log(`   ${index + 1}. ${ip}`);
        });
    } catch (error) {
        console.error('❌ Erro ao listar IPs:', error.response?.data || error.message);
    }
};

// Função para obter IP público
const getPublicIP = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        console.log(`🌐 Seu IP público: ${response.data.ip}`);
        return response.data.ip;
    } catch (error) {
        console.error('❌ Erro ao obter IP público:', error.message);
        return null;
    }
};

// Menu interativo
const showMenu = () => {
    console.log('\n🔒 Menu de Gerenciamento:');
    console.log('1. Adicionar IP');
    console.log('2. Remover IP');
    console.log('3. Listar IPs autorizados');
    console.log('4. Obter meu IP público');
    console.log('5. Adicionar meu IP atual');
    console.log('0. Sair');
};

// Executar comando
const executeCommand = async () => {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        showMenu();
        return;
    }
    
    const command = args[0];
    
    switch (command) {
        case 'add':
            if (args[1]) {
                await addIP(args[1]);
            } else {
                console.log('❌ Uso: node ip-manager.js add <IP>');
            }
            break;
            
        case 'remove':
            if (args[1]) {
                await removeIP(args[1]);
            } else {
                console.log('❌ Uso: node ip-manager.js remove <IP>');
            }
            break;
            
        case 'list':
            await listIPs();
            break;
            
        case 'myip':
            await getPublicIP();
            break;
            
        case 'addmyip':
            const myIP = await getPublicIP();
            if (myIP) {
                await addIP(myIP);
            }
            break;
            
        default:
            console.log('❌ Comando inválido');
            showMenu();
    }
};

// Executar
executeCommand();

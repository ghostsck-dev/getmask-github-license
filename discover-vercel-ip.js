const axios = require('axios');

console.log('🔍 Descobrindo IP do Vercel para MongoDB Atlas...\n');

async function discoverVercelIP() {
    try {
        // Tentar descobrir IP do Vercel através de um serviço
        const response = await axios.get('https://api.ipify.org?format=json');
        const currentIP = response.data.ip;
        
        console.log('🌐 IP atual detectado:', currentIP);
        console.log('');
        
        console.log('📋 CONFIGURAÇÃO MONGODB ATLAS:');
        console.log('1. Acesse: https://cloud.mongodb.com/');
        console.log('2. Vá para: Network Access');
        console.log('3. Clique em: "Add IP Address"');
        console.log('4. Adicione: 0.0.0.0/0');
        console.log('5. Descrição: "Permitir Vercel e todos os IPs"');
        console.log('6. Clique em: "Confirm"');
        console.log('');
        
        console.log('⚠️ IMPORTANTE:');
        console.log('- 0.0.0.0/0 permite TODOS os IPs');
        console.log('- Isso inclui Vercel, Render, e qualquer outro serviço');
        console.log('- Para máxima segurança, use IPs específicos');
        console.log('');
        
        console.log('🔒 ALTERNATIVA MAIS SEGURA:');
        console.log('1. Descobrir IPs específicos do Vercel');
        console.log('2. Adicionar apenas esses IPs');
        console.log('3. Manter seu IP (10.9.60.102/22)');
        console.log('');
        
        console.log('🎯 RESULTADO ESPERADO:');
        console.log('- Vercel consegue acessar MongoDB Atlas');
        console.log('- Empresas aparecem no sistema');
        console.log('- Login admin funciona perfeitamente');
        
    } catch (error) {
        console.error('❌ Erro ao descobrir IP:', error.message);
        console.log('');
        console.log('🔄 SOLUÇÃO RÁPIDA:');
        console.log('Adicione 0.0.0.0/0 no MongoDB Atlas');
        console.log('Isso permitirá acesso do Vercel');
    }
}

discoverVercelIP();

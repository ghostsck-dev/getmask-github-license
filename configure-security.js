const axios = require('axios');

console.log('🔍 Descobrindo IPs para configuração de segurança...\n');

async function discoverIPs() {
    try {
        // Descobrir IP público atual
        const response = await axios.get('https://api.ipify.org?format=json');
        const currentIP = response.data.ip;
        
        console.log('🌐 Seu IP atual:', currentIP);
        console.log('🎯 IP autorizado no sistema:', '10.9.60.102/22');
        console.log('');
        
        console.log('📋 CONFIGURAÇÃO MONGODB ATLAS:');
        console.log('1. Acesse: https://cloud.mongodb.com/');
        console.log('2. Vá para: Network Access');
        console.log('3. Adicione estes IPs:');
        console.log('   - 0.0.0.0/0 (permite todos - para Vercel)');
        console.log('   - 10.9.60.102/22 (seu IP específico)');
        console.log('');
        
        console.log('🔒 CONFIGURAÇÃO DE SEGURANÇA:');
        console.log('✅ Sistema já configurado para:');
        console.log('   - Apenas IP 10.9.60.102/22 pode acessar APIs administrativas');
        console.log('   - APIs de licença ficam livres para clientes');
        console.log('   - MongoDB Atlas acessível pelo Vercel');
        console.log('');
        
        console.log('🌐 URLs IMPORTANTES:');
        console.log('   - Sistema: https://getmask.vercel.app/');
        console.log('   - API Status: https://getmask.vercel.app/api/status');
        console.log('   - API Companies: https://getmask.vercel.app/api/companies');
        console.log('   - API License: https://getmask.vercel.app/api/license/check');
        console.log('');
        
        console.log('⚠️ IMPORTANTE:');
        console.log('- Apenas seu IP (10.9.60.102/22) pode gerenciar empresas');
        console.log('- Clientes podem validar licenças normalmente');
        console.log('- MongoDB Atlas deve permitir conexões do Vercel');
        
    } catch (error) {
        console.error('❌ Erro ao descobrir IP:', error.message);
    }
}

discoverIPs();

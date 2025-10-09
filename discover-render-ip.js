const axios = require('axios');

console.log('🔍 Descobrindo IP do Render para MongoDB Atlas...\n');

async function getRenderIP() {
    try {
        // Usar um serviço para descobrir o IP público do Render
        const response = await axios.get('https://api.ipify.org?format=json');
        const renderIP = response.data.ip;
        
        console.log('🌐 IP do Render:', renderIP);
        console.log('');
        console.log('📋 PRÓXIMOS PASSOS:');
        console.log('1. Acesse: https://cloud.mongodb.com/');
        console.log('2. Vá para: Network Access');
        console.log('3. Clique em: "Add IP Address"');
        console.log('4. Adicione o IP:', renderIP);
        console.log('5. Ou use: 0.0.0.0/0 (permitir todos os IPs)');
        console.log('');
        console.log('⚠️ IMPORTANTE:');
        console.log('- Use 0.0.0.0/0 apenas para desenvolvimento');
        console.log('- Para produção, use IPs específicos');
        console.log('- O IP do Render pode mudar');
        
        return renderIP;
        
    } catch (error) {
        console.error('❌ Erro ao descobrir IP:', error.message);
        console.log('');
        console.log('🔄 Alternativa: Use 0.0.0.0/0 no MongoDB Atlas');
        console.log('   (Permite conexões de qualquer IP)');
    }
}

getRenderIP();

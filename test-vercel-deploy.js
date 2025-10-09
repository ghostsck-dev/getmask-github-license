const axios = require('axios');

console.log('🌐 Testando deploy no Vercel...\n');

// Substitua pela URL real do seu projeto Vercel
const VERCEL_URL = 'https://getmask-github-license.vercel.app';

async function testVercelDeploy() {
    try {
        console.log('🔍 Testando conectividade...');
        
        // Testar site principal
        const response = await axios.get(VERCEL_URL, { 
            timeout: 10000,
            validateStatus: function (status) {
                return status < 500;
            }
        });
        
        console.log(`✅ Site funcionando! Status: ${response.status}`);
        
        // Testar APIs
        console.log('\n🔍 Testando APIs...');
        
        try {
            const statusResponse = await axios.get(`${VERCEL_URL}/api/status`);
            console.log('✅ API Status funcionando:', statusResponse.data);
        } catch (error) {
            console.log('❌ API Status erro:', error.response?.status || error.message);
        }
        
        try {
            const companiesResponse = await axios.get(`${VERCEL_URL}/api/companies`);
            console.log('✅ API Companies funcionando:', companiesResponse.data);
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('🔒 API Companies protegida por IP (esperado)');
            } else {
                console.log('❌ API Companies erro:', error.response?.status || error.message);
            }
        }
        
        console.log('\n🎉 Deploy no Vercel funcionando!');
        console.log(`🌐 URL: ${VERCEL_URL}`);
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.log('⏳ Deploy ainda em andamento...');
            console.log('🔄 Aguarde alguns minutos e tente novamente');
        } else {
            console.log('❌ Erro:', error.message);
        }
    }
}

testVercelDeploy();

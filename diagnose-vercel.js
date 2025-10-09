const axios = require('axios');

console.log('🔍 Diagnosticando problema no Vercel...\n');

// Substitua pela URL real do seu projeto Vercel
const VERCEL_URL = 'https://getmask-github-license.vercel.app'; // ATUALIZE ESTA URL

async function diagnoseVercel() {
    try {
        console.log('🌐 Testando conectividade básica...');
        
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
            
            if (companiesResponse.data.companies && companiesResponse.data.companies.length === 0) {
                console.log('\n🔍 DIAGNÓSTICO: Array vazio - possível problema de conexão MongoDB');
                console.log('💡 Soluções:');
                console.log('1. Verificar se MONGODB_URI está configurada no Vercel');
                console.log('2. Verificar se MongoDB Atlas permite conexões do Vercel');
                console.log('3. Verificar logs do Vercel para erros de conexão');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('🔒 API Companies protegida por IP (esperado)');
            } else {
                console.log('❌ API Companies erro:', error.response?.status || error.message);
            }
        }
        
        // Testar license check (deve funcionar sem IP)
        try {
            const licenseResponse = await axios.post(`${VERCEL_URL}/api/license/check`, {
                company: 'TESTE',
                nagios_url: '192.168.1.1'
            });
            console.log('✅ API License Check funcionando:', licenseResponse.data);
        } catch (error) {
            console.log('❌ API License Check erro:', error.response?.status || error.message);
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.log('⏳ Deploy ainda em andamento...');
            console.log('🔄 Aguarde alguns minutos e tente novamente');
        } else {
            console.log('❌ Erro:', error.message);
        }
    }
}

// Verificar se a URL foi atualizada
if (VERCEL_URL.includes('getmask-github-license.vercel.app')) {
    console.log('⚠️ ATUALIZE A URL DO VERCEL no script!');
    console.log('Substitua a linha 6 pela URL real do seu projeto');
} else {
    diagnoseVercel();
}

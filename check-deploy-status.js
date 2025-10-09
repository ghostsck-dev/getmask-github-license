const axios = require('axios');

console.log('🔍 Verificando status do deploy no Render...\n');

const SERVER_URL = 'https://getmask-github-license.onrender.com';

async function checkDeployStatus() {
    try {
        console.log('🌐 Testando conectividade básica...');
        
        // Testar se o servidor responde
        const response = await axios.get(SERVER_URL, { 
            timeout: 10000,
            validateStatus: function (status) {
                return status < 500; // Aceitar qualquer status < 500
            }
        });
        
        console.log(`✅ Servidor respondendo! Status: ${response.status}`);
        console.log(`📄 Tipo de conteúdo: ${response.headers['content-type']}`);
        
        if (response.status === 200) {
            console.log('🎉 Site funcionando!');
            
            // Testar APIs
            console.log('\n🔍 Testando APIs...');
            
            try {
                const statusResponse = await axios.get(`${SERVER_URL}/api/status`);
                console.log('✅ API Status funcionando:', statusResponse.data);
            } catch (error) {
                console.log('❌ API Status erro:', error.response?.status || error.message);
            }
            
            try {
                const companiesResponse = await axios.get(`${SERVER_URL}/api/companies`);
                console.log('✅ API Companies funcionando:', companiesResponse.data);
            } catch (error) {
                if (error.response?.status === 403) {
                    console.log('🔒 API Companies protegida por IP (esperado)');
                } else {
                    console.log('❌ API Companies erro:', error.response?.status || error.message);
                }
            }
        } else {
            console.log(`⚠️ Site retornou status ${response.status}`);
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.log('❌ Servidor não está respondendo - deploy pode estar em andamento');
        } else if (error.response?.status === 404) {
            console.log('❌ Servidor retornando 404 - arquivo não encontrado');
        } else {
            console.log('❌ Erro:', error.message);
        }
    }
}

checkDeployStatus();

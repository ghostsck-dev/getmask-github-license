const axios = require('axios');

console.log('🌐 Testando acesso ao servidor Render...\n');

const SERVER_URL = 'https://getmask-github-license.onrender.com';

async function testEndpoints() {
    try {
        // Testar status (deve funcionar sem IP)
        console.log('1️⃣ Testando /api/status...');
        const statusResponse = await axios.get(`${SERVER_URL}/api/status`);
        console.log('✅ Status OK:', statusResponse.data);
        
        // Testar companies (pode ser bloqueado por IP)
        console.log('\n2️⃣ Testando /api/companies...');
        try {
            const companiesResponse = await axios.get(`${SERVER_URL}/api/companies`);
            console.log('✅ Companies OK:', companiesResponse.data);
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('❌ Companies bloqueado por IP:', error.response.data);
            } else {
                console.log('❌ Erro inesperado:', error.message);
            }
        }
        
        // Testar license check (deve funcionar sem IP)
        console.log('\n3️⃣ Testando /api/license/check...');
        try {
            const licenseResponse = await axios.post(`${SERVER_URL}/api/license/check`, {
                company: 'TESTE',
                nagios_url: '192.168.1.1'
            });
            console.log('✅ License check OK:', licenseResponse.data);
        } catch (error) {
            console.log('❌ License check erro:', error.response?.data || error.message);
        }
        
    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testEndpoints();

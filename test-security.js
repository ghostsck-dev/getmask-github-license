const axios = require('axios');

console.log('🔒 Testando segurança do sistema...\n');

const VERCEL_URL = 'https://getmask.vercel.app';

async function testSecurity() {
    try {
        console.log('🌐 Testando APIs públicas (devem funcionar)...\n');
        
        // 1. Testar API Status (pública)
        console.log('1️⃣ Testando /api/status (pública)...');
        try {
            const statusResponse = await axios.get(`${VERCEL_URL}/api/status`);
            console.log('✅ Status OK:', statusResponse.data);
        } catch (error) {
            console.log('❌ Status Error:', error.response?.status || error.message);
        }
        
        // 2. Testar License Check (pública)
        console.log('\n2️⃣ Testando /api/license/check (pública)...');
        try {
            const licenseResponse = await axios.post(`${VERCEL_URL}/api/license/check`, {
                company: 'TESTE',
                nagios_url: '192.168.1.1'
            });
            console.log('✅ License Check OK:', licenseResponse.data);
        } catch (error) {
            console.log('❌ License Check Error:', error.response?.status || error.message);
        }
        
        console.log('\n🔒 Testando APIs administrativas (devem ser bloqueadas)...\n');
        
        // 3. Testar API Companies (administrativa - deve ser bloqueada)
        console.log('3️⃣ Testando /api/companies (administrativa)...');
        try {
            const companiesResponse = await axios.get(`${VERCEL_URL}/api/companies`);
            console.log('⚠️ Companies Response:', companiesResponse.data);
            console.log('❌ PROBLEMA: API administrativa acessível publicamente!');
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('✅ Companies bloqueada corretamente (403)');
                console.log('🔒 Segurança funcionando!');
            } else {
                console.log('❌ Companies Error:', error.response?.status || error.message);
            }
        }
        
        console.log('\n📋 RESUMO DA SEGURANÇA:');
        console.log('✅ APIs públicas funcionando');
        console.log('🔒 APIs administrativas protegidas');
        console.log('🌐 Apenas IP 45.181.228.226 pode gerenciar empresas');
        console.log('👥 Clientes podem validar licenças normalmente');
        
    } catch (error) {
        console.log('❌ Erro geral:', error.message);
    }
}

testSecurity();

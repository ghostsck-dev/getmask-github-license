const axios = require('axios');

console.log('🔍 Diagnosticando problema MongoDB no Vercel...\n');

const VERCEL_URL = 'https://getmask.vercel.app';

async function diagnoseMongoDB() {
    try {
        console.log('🌐 Testando APIs do Vercel...\n');
        
        // 1. Testar API Status
        console.log('1️⃣ Testando /api/status...');
        try {
            const statusResponse = await axios.get(`${VERCEL_URL}/api/status`);
            console.log('✅ Status OK:', statusResponse.data);
            
            // Verificar informações específicas
            if (statusResponse.data.database_status) {
                console.log('📊 Database Status:', statusResponse.data.database_status);
            }
            if (statusResponse.data.total_companies !== undefined) {
                console.log('🏢 Total Companies:', statusResponse.data.total_companies);
            }
        } catch (error) {
            console.log('❌ Status Error:', error.response?.status || error.message);
        }
        
        // 2. Testar API Companies
        console.log('\n2️⃣ Testando /api/companies...');
        try {
            const companiesResponse = await axios.get(`${VERCEL_URL}/api/companies`);
            console.log('✅ Companies Response:', companiesResponse.data);
            
            if (companiesResponse.data.companies) {
                console.log('📊 Companies Array Length:', companiesResponse.data.companies.length);
                if (companiesResponse.data.companies.length === 0) {
                    console.log('🔍 DIAGNÓSTICO: Array vazio - problema de conexão MongoDB');
                }
            }
        } catch (error) {
            if (error.response?.status === 403) {
                console.log('🔒 Companies protegida por IP (esperado)');
            } else {
                console.log('❌ Companies Error:', error.response?.status || error.message);
            }
        }
        
        // 3. Testar License Check (deve funcionar sem IP)
        console.log('\n3️⃣ Testando /api/license/check...');
        try {
            const licenseResponse = await axios.post(`${VERCEL_URL}/api/license/check`, {
                company: 'TESTE',
                nagios_url: '192.168.1.1'
            });
            console.log('✅ License Check OK:', licenseResponse.data);
        } catch (error) {
            console.log('❌ License Check Error:', error.response?.status || error.message);
        }
        
        console.log('\n🔍 POSSÍVEIS CAUSAS:');
        console.log('1. ❌ MONGODB_URI não configurada no Vercel');
        console.log('2. ❌ MongoDB Atlas bloqueando IPs do Vercel');
        console.log('3. ❌ Erro na conexão MongoDB no servidor Vercel');
        console.log('4. ❌ Variáveis de ambiente incorretas');
        
        console.log('\n💡 SOLUÇÕES:');
        console.log('1. ✅ Verificar Environment Variables no Vercel');
        console.log('2. ✅ Adicionar 0.0.0.0/0 na whitelist do MongoDB Atlas');
        console.log('3. ✅ Verificar logs do Vercel para erros');
        console.log('4. ✅ Testar conexão MongoDB localmente');
        
    } catch (error) {
        console.log('❌ Erro geral:', error.message);
    }
}

diagnoseMongoDB();

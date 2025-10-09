const mongoose = require('mongoose');

console.log('🔍 Testando conexão MongoDB Atlas localmente...\n');

const MONGODB_URI = 'mongodb+srv://ghostsck:1502%40Ghost0@clustermsk.rz7l7ke.mongodb.net/getmask-licenses?retryWrites=true&w=majority&appName=ClusterMsk';

// Schema da Empresa
const companySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    company_name: { type: String, required: true },
    nagios_url: { type: String, required: true },
    license_type: { type: String, required: true },
    expires: { type: String, required: true },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Company = mongoose.model('Company', companySchema);

async function testMongoDBConnection() {
    try {
        console.log('🔌 Conectando ao MongoDB Atlas...');
        console.log('📋 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Mascarar credenciais
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conectado com sucesso!');
        
        // Contar empresas
        const count = await Company.countDocuments();
        console.log(`📊 Total de empresas: ${count}`);
        
        // Listar empresas
        const companies = await Company.find().sort({ created_at: -1 });
        console.log('\n🏢 Empresas no banco:');
        companies.forEach((company, index) => {
            console.log(`${index + 1}. ${company.company_name} - ${company.nagios_url} - ${company.expires}`);
        });
        
        console.log('\n✅ MongoDB Atlas funcionando perfeitamente!');
        console.log('🔍 O problema está na configuração do Vercel');
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error.message);
        
        if (error.message.includes('whitelist')) {
            console.log('\n💡 SOLUÇÃO:');
            console.log('1. Acesse: https://cloud.mongodb.com/');
            console.log('2. Vá para: Network Access');
            console.log('3. Adicione: 0.0.0.0/0');
            console.log('4. Salve as alterações');
        }
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Desconectado do MongoDB');
    }
}

testMongoDBConnection();

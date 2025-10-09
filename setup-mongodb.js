const mongoose = require('mongoose');

console.log('🍃 Configurando MongoDB Atlas para GetMask...\n');

// URL de conexão do MongoDB Atlas
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

// Dados iniciais consolidados
const initialCompanies = [
    {
        key: "1720646400000",
        company_name: "WIKITELECOM",
        nagios_url: "172.16.14.178",
        license_type: "Licença Mensal",
        expires: "2025-12-31",
        active: true,
        created_at: new Date("2025-07-10T12:00:00.000Z")
    },
    {
        key: "1720646400001",
        company_name: "EMPRESA_EXEMPLO",
        nagios_url: "192.168.1.100",
        license_type: "Licença Mensal",
        expires: "2025-06-30",
        active: true,
        created_at: new Date("2025-07-10T12:00:00.000Z")
    },
    {
        key: "1720646400002",
        company_name: "EMPRESA_DESCONHECIDA",
        nagios_url: "172.16.14.178",
        license_type: "Licença Mensal",
        expires: "2025-12-31",
        active: true,
        created_at: new Date("2025-07-10T12:00:00.000Z")
    },
    {
        key: "1720646400003",
        company_name: "Wiki Telecom - Nagios Banda Larga",
        nagios_url: "172.16.14.178",
        license_type: "Licença Corporativa",
        expires: "2026-01-06",
        active: true,
        created_at: new Date("2025-07-10T12:00:00.000Z")
    },
    {
        key: "2",
        company_name: "Telecom ABC",
        nagios_url: "192.168.1.100",
        license_type: "Licença Mensal",
        expires: "2025-11-30",
        active: true,
        created_at: new Date("2025-01-15T00:00:00.000Z")
    }
];

// Função para configurar o banco
const setupDatabase = async () => {
    try {
        console.log('🔌 Conectando ao MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conectado ao MongoDB Atlas!');

        // Verificar se já existem dados
        const count = await Company.countDocuments();
        console.log(`📊 Empresas existentes: ${count}`);

        if (count === 0) {
            console.log('📝 Inserindo dados iniciais...');
            await Company.insertMany(initialCompanies);
            console.log('✅ Dados iniciais inseridos!');
        } else {
            console.log('ℹ️ Dados já existem no banco');
        }

        // Listar empresas
        const companies = await Company.find();
        console.log('\n🏢 Empresas no banco:');
        companies.forEach((company, index) => {
            console.log(`${index + 1}. ${company.company_name} - ${company.nagios_url} - ${company.expires}`);
        });

        console.log('\n🎉 Configuração concluída!');
        console.log('🌐 URL do banco: mongodb+srv://getmask:getmask123@cluster0.mongodb.net/getmask-licenses');
        
    } catch (error) {
        console.error('❌ Erro na configuração:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado do MongoDB');
    }
};

// Executar configuração
setupDatabase();

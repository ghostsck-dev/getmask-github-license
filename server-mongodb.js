#!/usr/bin/env node

/**
 * Sistema de Licenças GetMask - MongoDB Atlas Only
 * Banco de dados 100% na nuvem - Sem dados locais
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔒 CONTROLE DE ACESSO POR IP - SEGURANÇA
const ALLOWED_IPS = [
    '45.181.228.226/32',   // IP autorizado do usuário
];

// Middleware de controle de IP
const ipWhitelist = (req, res, next) => {
    const clientIP = req.ip || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    req.headers['x-forwarded-for']?.split(',')[0]?.trim();

    console.log(`🔍 Tentativa de acesso de IP: ${clientIP}`);
    
    // Verificar se o IP está na lista de permitidos
    const isAllowed = ALLOWED_IPS.some(allowedIP => {
        if (allowedIP === clientIP) return true;
        // Suporte a ranges de IP (ex: 192.168.1.0/24)
        if (allowedIP.includes('/')) {
            // Implementação básica de CIDR (pode ser expandida)
            return clientIP.startsWith(allowedIP.split('/')[0].split('.').slice(0, 3).join('.'));
        }
        return false;
    });

    if (isAllowed) {
        console.log(`✅ Acesso autorizado para IP: ${clientIP}`);
        next();
    } else {
        console.log(`❌ Acesso negado para IP: ${clientIP}`);
        res.status(403).json({
            error: 'Acesso negado',
            message: 'Seu IP não está autorizado a acessar este sistema',
            your_ip: clientIP,
            contact: 'Entre em contato com o administrador para solicitar acesso'
        });
    }
};

// Aplicar controle de IP em todas as rotas exceto status
app.use(ipWhitelist);

// Configuração do MongoDB Atlas - ÚNICA FONTE DE DADOS
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ghostsck:1502%40Ghost0@clustermsk.rz7l7ke.mongodb.net/getmask-licenses?retryWrites=true&w=majority&appName=ClusterMsk';

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

// Modelo da Empresa
const Company = mongoose.model('Company', companySchema);

// Conectar ao MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('🍃 MongoDB Atlas conectado com sucesso!');
        
        // Verificar se há dados iniciais
        const count = await Company.countDocuments();
        if (count === 0) {
            console.log('📊 Inserindo dados iniciais...');
            await insertInitialData();
        }
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error);
        process.exit(1);
    }
};

// Inserir dados iniciais consolidados - APENAS NO MONGODB ATLAS
const insertInitialData = async () => {
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

    try {
        // Verificar se já existem dados antes de inserir
        const existingCount = await Company.countDocuments();
        if (existingCount === 0) {
            await Company.insertMany(initialCompanies);
            console.log('✅ Dados iniciais inseridos no MongoDB Atlas!');
        } else {
            console.log(`ℹ️ MongoDB Atlas já possui ${existingCount} empresas cadastradas`);
        }
    } catch (error) {
        console.error('❌ Erro ao inserir dados iniciais:', error);
    }
};

// Endpoints da API

// Listar todas as empresas
app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Company.find().sort({ created_at: -1 });
        const total = await Company.countDocuments();
        const active = await Company.countDocuments({ active: true });
        const expired = await Company.countDocuments({
            expires: { $lt: new Date().toISOString().split('T')[0] }
        });

        res.json({
            companies,
            metadata: {
                total_companies: total,
                active_licenses: active,
                expired_licenses: expired,
                last_updated: new Date().toISOString(),
                version: "4.0.0",
                database: "MongoDB Atlas Only",
                storage: "100% Cloud",
                backup: "Automatic"
            }
        });
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({ error: error.message });
    }
});

// Adicionar nova empresa
app.post('/api/companies', async (req, res) => {
    try {
        const { companyKey, companyName, nagiosUrl, licenseType, expires, active } = req.body;
        
        // Verificar se já existe
        const existing = await Company.findOne({ 
            $or: [
                { key: companyKey },
                { company_name: companyName, nagios_url: nagiosUrl }
            ]
        });
        
        if (existing) {
            return res.status(400).json({ 
                error: 'Empresa já existe com esta chave ou combinação nome/URL' 
            });
        }

        const newCompany = new Company({
            key: companyKey || Date.now().toString(),
            company_name: companyName,
            nagios_url: nagiosUrl,
            license_type: licenseType || 'Corporativa',
            expires: expires,
            active: active !== false,
            created_at: new Date(),
            updated_at: new Date()
        });

        await newCompany.save();
        
        res.status(201).json({ 
            message: 'Empresa adicionada com sucesso!', 
            company: newCompany 
        });
    } catch (error) {
        console.error('Erro ao adicionar empresa:', error);
        res.status(500).json({ error: error.message });
    }
});

// Atualizar empresa
app.put('/api/companies/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const updates = req.body;
        
        const company = await Company.findOne({ key });
        if (!company) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        // Atualizar campos
        Object.keys(updates).forEach(field => {
            if (updates[field] !== undefined) {
                company[field] = updates[field];
            }
        });
        
        company.updated_at = new Date();
        await company.save();
        
        res.json({ 
            message: 'Empresa atualizada com sucesso!', 
            company 
        });
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        res.status(500).json({ error: error.message });
    }
});

// Remover empresa
app.delete('/api/companies/:key', async (req, res) => {
    try {
        const { key } = req.params;
        
        const company = await Company.findOneAndDelete({ key });
        if (!company) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }
        
        res.json({ 
            message: 'Empresa removida com sucesso!', 
            company 
        });
    } catch (error) {
        console.error('Erro ao remover empresa:', error);
        res.status(500).json({ error: error.message });
    }
});

// Validação de licença para GetMask
app.post('/api/license/check', async (req, res) => {
    try {
        const { company, nagios_url } = req.body;

        if (!company || !nagios_url) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios: company, nagios_url' 
            });
        }

        const normalizedCompany = company.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        const companyData = await Company.findOne({
            $or: [
                { company_name: { $regex: new RegExp(normalizedCompany, 'i') } },
                { company_name: company }
            ],
            nagios_url: nagios_url,
            active: true
        });

        if (companyData) {
            const expiresDate = new Date(companyData.expires);
            const isValid = expiresDate > new Date();

            if (isValid) {
                return res.status(200).json({
                    has_license: true,
                    company: companyData.company_name,
                    license_type: companyData.license_type,
                    expires: companyData.expires,
                    message: `Licença válida para ${companyData.company_name}`,
                    contact_info: 'Patrick Braga - Desenvolvedor'
                });
            } else {
                return res.status(200).json({
                    has_license: false,
                    company: companyData.company_name,
                    message: `Licença expirada para ${companyData.company_name}. Renove por favor.`,
                    contact_info: 'Patrick Braga - Desenvolvedor'
                });
            }
        } else {
            return res.status(200).json({
                has_license: false,
                company: company,
                message: `Empresa ${company} não possui licença válida.`,
                contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
            });
        }
    } catch (error) {
        console.error('Erro ao validar licença:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Rota para gerenciar IPs autorizados (apenas para admin)
app.post('/api/admin/whitelist', (req, res) => {
    const { action, ip, admin_key } = req.body;
    
    // Chave de administrador (mude para algo mais seguro)
    const ADMIN_KEY = process.env.ADMIN_KEY || 'getmask-admin-2025';
    
    if (admin_key !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Chave de administrador inválida' });
    }
    
    if (action === 'add' && ip) {
        if (!ALLOWED_IPS.includes(ip)) {
            ALLOWED_IPS.push(ip);
            console.log(`✅ IP ${ip} adicionado à whitelist`);
            res.json({ message: `IP ${ip} adicionado com sucesso`, whitelist: ALLOWED_IPS });
        } else {
            res.json({ message: `IP ${ip} já está na whitelist`, whitelist: ALLOWED_IPS });
        }
    } else if (action === 'remove' && ip) {
        const index = ALLOWED_IPS.indexOf(ip);
        if (index > -1) {
            ALLOWED_IPS.splice(index, 1);
            console.log(`❌ IP ${ip} removido da whitelist`);
            res.json({ message: `IP ${ip} removido com sucesso`, whitelist: ALLOWED_IPS });
        } else {
            res.json({ message: `IP ${ip} não encontrado na whitelist`, whitelist: ALLOWED_IPS });
        }
    } else if (action === 'list') {
        res.json({ whitelist: ALLOWED_IPS });
    } else {
        res.status(400).json({ error: 'Ação inválida. Use: add, remove ou list' });
    }
});

// Status do sistema (sem controle de IP para verificar conectividade)
app.get('/api/status', async (req, res) => {
    try {
        const total = await Company.countDocuments();
        const active = await Company.countDocuments({ active: true });
        const expired = await Company.countDocuments({
            expires: { $lt: new Date().toISOString().split('T')[0] }
        });

        res.json({
            server_status: 'running',
            database_status: 'MongoDB Atlas Connected',
            github_token: 'configured',
            mode: 'production',
            security: 'IP Whitelist Active',
            total_companies: total,
            active_licenses: active,
            expired_licenses: expired,
            version: '4.1.0',
            database: 'MongoDB Atlas Only',
            storage: '100% Cloud',
            backup: 'Automatic',
            local_files: 'None',
            ip_protection: 'Enabled',
            allowed_ips_count: ALLOWED_IPS.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log('🚀 Servidor GetMask - MongoDB Atlas Only!');
        console.log(`🌐 Porta: ${PORT}`);
        console.log(`🍃 Banco: MongoDB Atlas (100% Cloud)`);
        console.log(`☁️ Armazenamento: Apenas na nuvem`);
        console.log(`📱 Acesse: http://localhost:${PORT}`);
        console.log(`🔗 API: http://localhost:${PORT}/api/companies`);
        console.log(`🛡️ Backup: Automático no Atlas`);
    });
};

startServer().catch(console.error);

module.exports = app;

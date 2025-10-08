#!/usr/bin/env node

/**
 * GetMask License System - Teste Local
 * Este script testa o sistema localmente sem GitHub API
 */

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dados de teste em memória
let companies = [
    {
        key: "1",
        name: "Wikitelecom",
        normalizedName: "WIKITELECOM",
        nagiosUrl: "172.16.14.178",
        expires: "2025-12-31",
        licenseType: "Licença Corporativa",
        contact: "Patrick Braga - Desenvolvedor",
        isActive: true,
        createdAt: "2025-01-01T00:00:00.000Z"
    },
    {
        key: "2",
        name: "Telecom ABC",
        normalizedName: "TELECOMABC",
        nagiosUrl: "192.168.1.100",
        expires: "2025-11-30",
        licenseType: "Licença Mensal",
        contact: "Patrick Braga - Desenvolvedor",
        isActive: true,
        createdAt: "2025-01-15T00:00:00.000Z"
    }
];

// Endpoints da API
app.get('/api/companies', (req, res) => {
    console.log('📋 GET /api/companies - Retornando', companies.length, 'empresas');
    res.json({ companies });
});

app.post('/api/companies', (req, res) => {
    const { name, nagiosUrl, expires, licenseType } = req.body;
    
    if (!name || !nagiosUrl || !expires || !licenseType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCompany = {
        key: Date.now().toString(),
        name,
        normalizedName: name.toUpperCase().replace(/[^A-Z0-9]/g, ''),
        nagiosUrl,
        expires,
        licenseType,
        contact: 'Patrick Braga - Desenvolvedor',
        isActive: true,
        createdAt: new Date().toISOString()
    };

    companies.push(newCompany);
    console.log('➕ POST /api/companies - Empresa adicionada:', newCompany.name);
    
    res.status(201).json({ message: 'Company added successfully', company: newCompany });
});

app.delete('/api/companies/:key', (req, res) => {
    const key = req.params.key;
    const initialLength = companies.length;
    companies = companies.filter(c => c.key !== key);
    
    if (companies.length === initialLength) {
        return res.status(404).json({ error: 'Company not found' });
    }
    
    console.log('🗑️ DELETE /api/companies/' + key + ' - Empresa removida');
    res.json({ message: 'Company deleted successfully' });
});

app.post('/api/license/check', (req, res) => {
    const { company, nagios_url } = req.body;
    
    console.log('🔍 POST /api/license/check - Validando:', company, nagios_url);
    
    const normalizedCompany = company.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const normalizeNagiosUrl = (url) => {
        try {
            const uri = new URL(url);
            return uri.hostname;
        } catch {
            return url.replace(/^https?:\/\//, '').split('/')[0];
        }
    };
    
    const normalizedNagiosUrl = normalizeNagiosUrl(nagios_url);
    
    const companyData = companies.find(
        c => c.normalizedName === normalizedCompany && 
             (c.nagiosUrl === nagios_url || c.nagiosUrl === normalizedNagiosUrl) &&
             c.isActive
    );

    if (companyData) {
        const expiresDate = new Date(companyData.expires);
        const isValid = expiresDate > new Date();
        
        const result = {
            has_license: isValid,
            company: companyData.name,
            license_type: companyData.licenseType,
            expires: companyData.expires,
            message: isValid ? `Licença válida para ${companyData.name}` : `Licença expirada para ${companyData.name}`,
            contact_info: companyData.contact
        };
        
        console.log('✅ Licença encontrada:', result);
        res.json(result);
    } else {
        const result = {
            has_license: false,
            company: company,
            message: 'Empresa não possui licença válida',
            contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
        };
        
        console.log('❌ Licença não encontrada:', result);
        res.json(result);
    }
});

// Servir interface web
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GetMask License System - Teste Local</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .api-list { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .endpoint { margin: 10px 0; font-family: monospace; }
                .method { font-weight: bold; color: #007bff; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎭 GetMask License System</h1>
                <div class="status">
                    <h3>✅ Servidor funcionando!</h3>
                    <p>Modo: <strong>Teste Local</strong></p>
                    <p>Empresas cadastradas: <strong>${companies.length}</strong></p>
                </div>
                
                <div class="api-list">
                    <h3>🔌 Endpoints da API:</h3>
                    <div class="endpoint"><span class="method">GET</span> /api/companies - Listar empresas</div>
                    <div class="endpoint"><span class="method">POST</span> /api/companies - Adicionar empresa</div>
                    <div class="endpoint"><span class="method">DELETE</span> /api/companies/:key - Remover empresa</div>
                    <div class="endpoint"><span class="method">POST</span> /api/license/check - Validar licença</div>
                </div>
                
                <h3>🧪 Teste rápido:</h3>
                <p><a href="/api/companies" target="_blank">Ver empresas cadastradas</a></p>
                <p><a href="/api/license/check" target="_blank">Testar validação de licença</a></p>
                
                <h3>📱 Integração GetMask:</h3>
                <p>URL da API: <code>http://localhost:3000</code></p>
                <p>Configure no GetMask app para usar esta URL local.</p>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🎭 GetMask License System - Teste Local');
    console.log('=====================================');
    console.log('✅ Servidor iniciado na porta', PORT);
    console.log('🌐 Acesse: http://localhost:' + PORT);
    console.log('📱 API: http://localhost:' + PORT + '/api/companies');
    console.log('🔍 Teste: http://localhost:' + PORT + '/api/license/check');
    console.log('');
    console.log('📋 Empresas de teste carregadas:', companies.length);
    console.log('⏹️  Para parar: Ctrl+C');
    console.log('');
});

#!/usr/bin/env node

/**
 * Sistema de Licenças GetMask - Versão Segura
 * Este servidor é independente e não expõe informações do projeto principal
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração com dados consolidados
const LICENSES_DATA = {
    companies: [
        {
            key: "1720646400000",
            company_name: "WIKITELECOM",
            nagios_url: "172.16.14.178",
            license_type: "Licença Mensal",
            expires: "2025-12-31",
            active: true,
            created_at: "2025-07-10T12:00:00.000Z"
        },
        {
            key: "1720646400001",
            company_name: "EMPRESA_EXEMPLO",
            nagios_url: "192.168.1.100",
            license_type: "Licença Mensal",
            expires: "2025-06-30",
            active: true,
            created_at: "2025-07-10T12:00:00.000Z"
        },
        {
            key: "1720646400002",
            company_name: "EMPRESA_DESCONHECIDA",
            nagios_url: "172.16.14.178",
            license_type: "Licença Mensal",
            expires: "2025-12-31",
            active: true,
            created_at: "2025-07-10T12:00:00.000Z"
        },
        {
            key: "1720646400003",
            company_name: "Wiki Telecom - Nagios Banda Larga",
            nagios_url: "172.16.14.178",
            license_type: "Licença Corporativa",
            expires: "2026-01-06",
            active: true,
            created_at: "2025-07-10T12:00:00.000Z"
        },
        {
            key: "2",
            company_name: "Telecom ABC",
            nagios_url: "192.168.1.100",
            license_type: "Licença Mensal",
            expires: "2025-11-30",
            active: true,
            created_at: "2025-01-15T00:00:00.000Z"
        }
    ],
    metadata: {
        last_updated: "2025-10-09T13:13:30.858Z",
        version: "2.0.0",
        total_companies: 5,
        active_licenses: 5,
        expired_licenses: 1,
        consolidated_from: [
            "public/licenses.json",
            "getmask-licenses/api/licenses.json",
            "public/licenses-github.json",
            "public/github-pages-licenses.json"
        ],
        migration_date: "2025-10-09T13:13:30.858Z"
    }
};

// Sistema de licenças simplificado e seguro
class SecureLicenseManager {
    constructor() {
        this.licenses = LICENSES_DATA;
    }

    // Buscar licenças
    async getLicenses() {
        return this.licenses;
    }

    // Adicionar empresa
    async addCompany(companyData) {
        console.log('📝 Dados recebidos:', companyData);
        
        const newCompany = {
            key: companyData.companyKey || Date.now().toString(),
            company_name: companyData.companyName,
            nagios_url: companyData.nagiosUrl,
            license_type: companyData.licenseType || 'Corporativa',
            expires: companyData.expires,
            active: companyData.active !== false,
            created_at: new Date().toISOString()
        };

        console.log('✅ Empresa criada:', newCompany);
        this.licenses.companies.push(newCompany);
        return newCompany;
    }

    // Atualizar empresa
    async updateCompany(key, companyData) {
        const companyIndex = this.licenses.companies.findIndex(c => c.key === key);
        
        if (companyIndex === -1) {
            throw new Error('Empresa não encontrada');
        }

        this.licenses.companies[companyIndex] = {
            ...this.licenses.companies[companyIndex],
            company_name: companyData.companyName,
            nagios_url: companyData.nagiosUrl,
            license_type: companyData.licenseType,
            expires: companyData.expires,
            active: companyData.active,
            updated_at: new Date().toISOString()
        };

        return this.licenses.companies[companyIndex];
    }

    // Remover empresa
    async removeCompany(key) {
        this.licenses.companies = this.licenses.companies.filter(c => c.key !== key);
        return true;
    }

    // Validar licença por chave da empresa
    async validateLicenseByKey(companyKey, nagiosUrl) {
        const normalizeNagiosUrl = (url) => {
            try {
                const uri = new URL(url);
                return uri.hostname;
            } catch {
                return url.replace(/^https?:\/\//, '').split('/')[0];
            }
        };
        
        const normalizedNagiosUrl = normalizeNagiosUrl(nagiosUrl);
        
        const company = this.licenses.companies.find(
            c => c.key.toLowerCase() === companyKey.toLowerCase() && 
                 (c.nagios_url === nagiosUrl || c.nagios_url === normalizedNagiosUrl) &&
                 c.active
        );

        if (company) {
            const expiresDate = new Date(company.expires);
            const isValid = expiresDate > new Date();
            
            return {
                valid: isValid,
                has_license: isValid,
                company: company.company_name,
                company_key: company.key,
                license_type: company.license_type,
                expires: company.expires,
                message: isValid ? `Licença válida para ${company.company_name}` : `Licença expirada para ${company.company_name}`,
                contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
            };
        }

        return {
            valid: false,
            has_license: false,
            company_key: companyKey,
            message: 'Chave da empresa não possui licença válida',
            contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
        };
    }

    // Validar licença
    async validateLicense(companyName, nagiosUrl) {
        const normalizeNagiosUrl = (url) => {
            try {
                const uri = new URL(url);
                return uri.hostname;
            } catch {
                return url.replace(/^https?:\/\//, '').split('/')[0];
            }
        };
        
        const normalizedNagiosUrl = normalizeNagiosUrl(nagiosUrl);
        
        const company = this.licenses.companies.find(
            c => c.company_name.toLowerCase() === companyName.toLowerCase() && 
                 (c.nagios_url === nagiosUrl || c.nagios_url === normalizedNagiosUrl) &&
                 c.active
        );

        if (company) {
            const expiresDate = new Date(company.expires);
            const isValid = expiresDate > new Date();
            
            return {
                valid: isValid,
                has_license: isValid,
                company: company.company_name,
                license_type: company.license_type,
                expires: company.expires,
                message: isValid ? `Licença válida para ${company.company_name}` : `Licença expirada para ${company.company_name}`,
                contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
            };
        }

        return {
            valid: false,
            has_license: false,
            company: companyName,
            message: 'Empresa não possui licença válida',
            contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
        };
    }
}

const licenseManager = new SecureLicenseManager();

// Endpoints da API
app.get('/api/companies', async (req, res) => {
    try {
        const licenses = await licenseManager.getLicenses();
        res.json(licenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/companies', async (req, res) => {
    try {
        const company = await licenseManager.addCompany(req.body);
        res.status(201).json({ message: 'Company added successfully', company });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/companies/:key', async (req, res) => {
    try {
        const company = await licenseManager.updateCompany(req.params.key, req.body);
        res.json({ message: 'Company updated successfully', company });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/companies/:key', async (req, res) => {
    try {
        await licenseManager.removeCompany(req.params.key);
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/license/check-by-key', async (req, res) => {
    try {
        const { company_key, nagios_url } = req.body;
        const result = await licenseManager.validateLicenseByKey(company_key, nagios_url);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir interface web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🎭 Sistema de Licenças GetMask - Versão Segura');
    console.log('==============================================');
    console.log('✅ Servidor iniciado na porta', PORT);
    console.log('🌐 Acesse:', `http://localhost:${PORT}`);
    console.log('📱 API:', `http://localhost:${PORT}/api/companies`);
    console.log('🔍 Teste:', `http://localhost:${PORT}/api/license/check`);
    console.log('');
    console.log('🔒 Modo: Seguro - Sem exposição de código');
    console.log('💾 Armazenamento: Memória (temporário)');
    console.log('');
});

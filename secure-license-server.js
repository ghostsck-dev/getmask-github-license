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

// Configuração simples e segura
const LICENSES_DATA = {
    companies: []
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
        const newCompany = {
            key: companyData.companyKey || Date.now().toString(),
            company_name: companyData.companyName,
            nagios_url: companyData.nagiosUrl,
            license_type: companyData.licenseType || 'Corporativa',
            expires: companyData.expires,
            active: companyData.active !== false,
            created_at: new Date().toISOString()
        };

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

app.post('/api/license/check', async (req, res) => {
    try {
        const { company, nagios_url } = req.body;
        const result = await licenseManager.validateLicense(company, nagios_url);
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

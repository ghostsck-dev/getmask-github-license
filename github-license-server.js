#!/usr/bin/env node

/**
 * GetMask License System - Production Server
 * Este servidor usa GitHub API para persistência de dados
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do GitHub
const GITHUB_CONFIG = {
    owner: 'ghostsck-dev',
    repo: 'getmask-licenses',
    token: process.env.GITHUB_TOKEN || '',
    branch: 'main'
};

// Arquivo de licenças no repositório
const LICENSES_FILE = 'api/licenses.json';

class GitHubLicenseManager {
    constructor() {
        this.baseUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;
        this.headers = {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GetMask-License-Manager'
        };
        // Armazenamento temporário em memória quando GitHub não está disponível
        this.tempStorage = { companies: [] };
    }

    // Buscar licenças do GitHub
    async getLicenses() {
        try {
            if (!GITHUB_CONFIG.token) {
                console.log('⚠️ GitHub token não configurado, usando armazenamento temporário');
                return this.tempStorage;
            }

            const response = await fetch(`${this.baseUrl}/contents/${LICENSES_FILE}`, {
                headers: this.headers
            });

            if (response.ok) {
                const data = await response.json();
                const content = Buffer.from(data.content, 'base64').toString('utf8');
                return JSON.parse(content);
            } else if (response.status === 404) {
                console.log('📁 Arquivo não existe, criando estrutura padrão');
                return { companies: [] };
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Erro ao buscar licenças:', error.message);
            console.log('🔄 Usando armazenamento temporário');
            return this.tempStorage;
        }
    }

    // Dados de teste quando GitHub não está disponível
    getTestData() {
        return {
            companies: [
                {
                    key: "wikitelecom",
                    company_name: "Wikitelecom",
                    nagios_url: "172.16.14.178",
                    license_type: "Corporativa",
                    expires: "2025-12-31",
                    active: true,
                    created_at: "2025-01-01T00:00:00.000Z"
                }
            ]
        };
    }

    // Salvar licenças no GitHub
    async saveLicenses(licenses) {
        try {
            if (!GITHUB_CONFIG.token) {
                console.log('⚠️ GitHub token não configurado, salvando em armazenamento temporário');
                this.tempStorage = licenses;
                return true;
            }

            // Primeiro, buscar o SHA do arquivo atual
            const getResponse = await fetch(`${this.baseUrl}/contents/${LICENSES_FILE}`, {
                headers: this.headers
            });

            let sha = null;
            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }

            // Preparar conteúdo
            const content = JSON.stringify(licenses, null, 2);
            const encodedContent = Buffer.from(content).toString('base64');

            // Salvar no GitHub
            const response = await fetch(`${this.baseUrl}/contents/${LICENSES_FILE}`, {
                method: 'PUT',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Update licenses - ${new Date().toISOString()}`,
                    content: encodedContent,
                    sha: sha
                })
            });

            if (response.ok) {
                console.log('✅ Licenças salvas no GitHub com sucesso');
                return true;
            } else {
                const error = await response.text();
                throw new Error(`Erro ao salvar: ${error}`);
            }
        } catch (error) {
            console.error('❌ Erro ao salvar licenças:', error.message);
            return false;
        }
    }

    // Adicionar nova empresa
    async addCompany(companyData) {
        const licenses = await this.getLicenses();
        
        const newCompany = {
            key: companyData.companyKey || Date.now().toString(),
            company_name: companyData.companyName,
            nagios_url: companyData.nagiosUrl,
            license_type: companyData.licenseType || 'Corporativa',
            expires: companyData.expires,
            active: companyData.active !== false,
            created_at: new Date().toISOString()
        };

        licenses.companies.push(newCompany);
        await this.saveLicenses(licenses);
        
        return newCompany;
    }

    // Atualizar empresa
    async updateCompany(key, companyData) {
        const licenses = await this.getLicenses();
        const companyIndex = licenses.companies.findIndex(c => c.key === key);
        
        if (companyIndex === -1) {
            throw new Error('Empresa não encontrada');
        }

        licenses.companies[companyIndex] = {
            ...licenses.companies[companyIndex],
            company_name: companyData.companyName,
            nagios_url: companyData.nagiosUrl,
            license_type: companyData.licenseType,
            expires: companyData.expires,
            active: companyData.active,
            updated_at: new Date().toISOString()
        };

        await this.saveLicenses(licenses);
        return licenses.companies[companyIndex];
    }

    // Remover empresa
    async removeCompany(key) {
        const licenses = await this.getLicenses();
        licenses.companies = licenses.companies.filter(c => c.key !== key);
        await this.saveLicenses(licenses);
        return true;
    }

    // Validar licença
    async validateLicense(companyName, nagiosUrl) {
        const licenses = await this.getLicenses();
        
        const normalizeNagiosUrl = (url) => {
            try {
                const uri = new URL(url);
                return uri.hostname;
            } catch {
                return url.replace(/^https?:\/\//, '').split('/')[0];
            }
        };
        
        const normalizedNagiosUrl = normalizeNagiosUrl(nagiosUrl);
        
        const company = licenses.companies.find(
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

const licenseManager = new GitHubLicenseManager();

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
    console.log('🎭 GetMask License System - Produção');
    console.log('==================================');
    console.log('✅ Servidor iniciado na porta', PORT);
    console.log('🌐 Acesse:', `http://localhost:${PORT}`);
    console.log('📱 API:', `http://localhost:${PORT}/api/companies`);
    console.log('🔍 Teste:', `http://localhost:${PORT}/api/license/check`);
    console.log('');
    console.log('🔑 GitHub Token:', GITHUB_CONFIG.token ? '✅ Configurado' : '❌ Não configurado');
    console.log('📋 Modo:', GITHUB_CONFIG.token ? 'GitHub API' : 'Dados de teste');
    console.log('');
});
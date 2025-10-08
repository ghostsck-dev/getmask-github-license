#!/usr/bin/env node

/**
 * Sistema de Licenças GetMask usando GitHub Pages + GitHub API
 * 
 * Esta solução usa:
 * - GitHub Pages para hospedar a interface web
 * - GitHub API para gerenciar licenças
 * - Arquivo JSON no repositório como banco de dados
 */

const fs = require('fs');
const path = require('path');

// Configuração do GitHub
const GITHUB_CONFIG = {
    owner: 'ghostsck-dev',
    repo: 'getmask-licenses',
    token: process.env.GITHUB_TOKEN || '', // Token de acesso pessoal
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
    }

    // Buscar licenças do GitHub
    async getLicenses() {
        try {
            const response = await fetch(`${this.baseUrl}/contents/${LICENSES_FILE}`, {
                headers: this.headers
            });

            if (response.ok) {
                const data = await response.json();
                const content = Buffer.from(data.content, 'base64').toString('utf8');
                return JSON.parse(content);
            } else if (response.status === 404) {
                // Arquivo não existe, criar estrutura padrão
                return { companies: [] };
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao buscar licenças:', error);
            throw error;
        }
    }

    // Salvar licenças no GitHub
    async saveLicenses(licenses) {
        try {
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
            console.error('Erro ao salvar licenças:', error);
            throw error;
        }
    }

    // Adicionar nova empresa
    async addCompany(companyData) {
        const licenses = await this.getLicenses();
        
        const newCompany = {
            key: Date.now().toString(),
            name: companyData.name,
            normalizedName: companyData.name.toUpperCase().replace(/[^A-Z0-9]/g, ''),
            nagiosUrl: companyData.nagiosUrl,
            expires: companyData.expires,
            licenseType: companyData.licenseType || 'Licença Corporativa',
            contact: companyData.contact || 'Patrick Braga - Desenvolvedor',
            isActive: true,
            createdAt: new Date().toISOString()
        };

        licenses.companies.push(newCompany);
        await this.saveLicenses(licenses);
        
        return newCompany;
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
        
        const normalizedCompany = companyName.toUpperCase().replace(/[^A-Z0-9]/g, '');
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
            c => c.normalizedName === normalizedCompany && 
                 (c.nagiosUrl === nagiosUrl || c.nagiosUrl === normalizedNagiosUrl) &&
                 c.isActive
        );

        if (company) {
            const expiresDate = new Date(company.expires);
            const isValid = expiresDate > new Date();
            
            return {
                has_license: isValid,
                company: company.name,
                license_type: company.licenseType,
                expires: company.expires,
                message: isValid ? `Licença válida para ${company.name}` : `Licença expirada para ${company.name}`,
                contact_info: company.contact
            };
        }

        return {
            has_license: false,
            company: companyName,
            message: 'Empresa não possui licença válida',
            contact_info: 'Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck'
        };
    }
}

// Servidor Express para API
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor GetMask License rodando na porta ${PORT}`);
    console.log(`📋 GitHub: ${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`);
});

module.exports = { GitHubLicenseManager };

#!/usr/bin/env node

/**
 * GetMask License System - Production Server
 * Este servidor usa GitHub API para persistência de dados
 */

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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
    }

    // Buscar licenças do GitHub
    async getLicenses() {
        try {
            if (!GITHUB_CONFIG.token) {
                console.log('⚠️ GitHub token não configurado, usando dados de teste');
                return this.getTestData();
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
            return this.getTestData();
        }
    }

    // Dados de teste quando GitHub não está disponível
    getTestData() {
        return {
            companies: [
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
            ]
        };
    }

    // Salvar licenças no GitHub
    async saveLicenses(licenses) {
        try {
            if (!GITHUB_CONFIG.token) {
                console.log('⚠️ GitHub token não configurado, dados não persistidos');
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

// Servir interface web
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GetMask License System</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
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
                    <p>Modo: <strong>Produção</strong></p>
                    <p>GitHub Token: <strong>${GITHUB_CONFIG.token ? '✅ Configurado' : '❌ Não configurado'}</strong></p>
                </div>
                
                ${!GITHUB_CONFIG.token ? `
                <div class="warning">
                    <h3>⚠️ Configuração Necessária</h3>
                    <p>Para persistência de dados, configure a variável de ambiente <code>GITHUB_TOKEN</code></p>
                    <p>Sem o token, o sistema funciona com dados de teste em memória.</p>
                </div>
                ` : ''}
                
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
                <p>URL da API: <code>${req.protocol}://${req.get('host')}</code></p>
                <p>Configure no GetMask app para usar esta URL.</p>
            </div>
        </body>
        </html>
    `);
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
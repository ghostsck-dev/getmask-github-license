const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Porta diferente para evitar conflito

app.use(bodyParser.json());
app.use(express.static('public'));

// Caminho para o arquivo de licenças
const LICENSES_FILE = path.join(__dirname, 'public', 'licenses.json');

// Helper para ler dados de licenças
const readLicenses = () => {
    try {
        const data = fs.readFileSync(LICENSES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler licenças:', error);
        return { companies: [] };
    }
};

// Helper para escrever dados de licenças
const writeLicenses = (data) => {
    try {
        fs.writeFileSync(LICENSES_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao escrever licenças:', error);
        return false;
    }
};

// API para GetMask validar licença
app.post('/api/license/check', (req, res) => {
    console.log('🔐 Validação de licença:', req.body);
    
    const { company, nagios_url, app_version } = req.body;

    if (!company || !nagios_url) {
        return res.status(400).json({ 
            error: 'Campos obrigatórios: company, nagios_url' 
        });
    }

    const licenses = readLicenses();
    const normalizedCompany = company.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const companyData = licenses.companies.find(
        c => c.normalizedName === normalizedCompany && c.nagiosUrl === nagios_url
    );

    if (companyData && companyData.isActive) {
        const expiresDate = new Date(companyData.expires);
        const isValid = expiresDate > new Date();

        if (isValid) {
            return res.status(200).json({
                has_license: true,
                company: companyData.name,
                license_type: companyData.licenseType,
                expires: companyData.expires,
                message: `Licença válida para ${companyData.name}`,
                contact_info: companyData.contact
            });
        } else {
            return res.status(200).json({
                has_license: false,
                company: companyData.name,
                message: `Licença expirada para ${companyData.name}. Renove por favor.`,
                contact_info: companyData.contact
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
});

// API para gerenciar licenças (CRUD completo)
app.get('/api/companies', (req, res) => {
    const licenses = readLicenses();
    res.json(licenses);
});

app.post('/api/companies', (req, res) => {
    const { name, nagiosUrl, expires, licenseType, contact } = req.body;
    
    if (!name || !nagiosUrl || !expires) {
        return res.status(400).json({ error: 'Campos obrigatórios: name, nagiosUrl, expires' });
    }

    const licenses = readLicenses();
    const normalizedName = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Verifica se já existe
    const existing = licenses.companies.find(
        c => c.normalizedName === normalizedName && c.nagiosUrl === nagiosUrl
    );
    
    if (existing) {
        return res.status(400).json({ error: 'Empresa já existe com esta URL do Nagios' });
    }

    const newCompany = {
        key: Date.now().toString(),
        name: name,
        normalizedName: normalizedName,
        nagiosUrl: nagiosUrl,
        expires: expires,
        licenseType: licenseType || 'Licença Mensal',
        contact: contact || 'Patrick Braga - Desenvolvedor',
        isActive: true,
        createdAt: new Date().toISOString()
    };

    licenses.companies.push(newCompany);
    
    if (writeLicenses(licenses)) {
        res.status(201).json(newCompany);
    } else {
        res.status(500).json({ error: 'Erro ao salvar empresa' });
    }
});

app.put('/api/companies/:key', (req, res) => {
    const { key } = req.params;
    const updates = req.body;
    
    const licenses = readLicenses();
    const index = licenses.companies.findIndex(c => c.key === key);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    // Atualiza campos permitidos
    const allowedFields = ['name', 'nagiosUrl', 'expires', 'licenseType', 'contact', 'isActive'];
    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            licenses.companies[index][field] = updates[field];
        }
    });

    // Recalcula normalizedName se name mudou
    if (updates.name) {
        licenses.companies[index].normalizedName = updates.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    if (writeLicenses(licenses)) {
        res.json(licenses.companies[index]);
    } else {
        res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
});

app.delete('/api/companies/:key', (req, res) => {
    const { key } = req.params;
    
    const licenses = readLicenses();
    const index = licenses.companies.findIndex(c => c.key === key);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const deletedCompany = licenses.companies.splice(index, 1)[0];
    
    if (writeLicenses(licenses)) {
        res.json({ message: 'Empresa removida com sucesso', company: deletedCompany });
    } else {
        res.status(500).json({ error: 'Erro ao remover empresa' });
    }
});

// Servir interface web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir arquivo de licenças diretamente
app.get('/api/licenses.json', (req, res) => {
    res.sendFile(LICENSES_FILE);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de licenças rodando em http://localhost:${PORT}`);
    console.log(`📊 Interface web: http://localhost:${PORT}`);
    console.log(`🔐 API de licenças: http://localhost:${PORT}/api/license/check`);
});

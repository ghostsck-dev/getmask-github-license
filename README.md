# 🎭 GetMask - Sistema de Licenças GitHub

## 🚀 **Nova Arquitetura Simplificada**

### **📋 Visão Geral:**
- **Frontend**: Interface web moderna e responsiva
- **Backend**: Servidor Node.js com GitHub API
- **Banco de Dados**: GitHub como storage (arquivo JSON)
- **Deploy**: Heroku/Railway para servidor + GitHub Pages para interface

---

## 🏗️ **Estrutura do Projeto:**

```
mascara_olt/server/
├── github-license-server.js      # Servidor Node.js principal
├── github-license-interface.html # Interface web
├── package-github.json           # Dependências Node.js
└── README.md                     # Este arquivo
```

---

## 🔧 **Configuração:**

### **1. Configurar GitHub Token:**
```bash
# Criar token de acesso pessoal no GitHub:
# Settings > Developer settings > Personal access tokens
# Permissões necessárias: repo (acesso completo ao repositório)

export GITHUB_TOKEN="seu_token_aqui"
```

### **2. Instalar Dependências:**
```bash
cd mascara_olt/server
npm install express cors
```

### **3. Executar Servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## 🌐 **Deploy:**

### **Opção 1: Heroku** ⭐ **RECOMENDADO**
```bash
# Instalar Heroku CLI
# Criar app
heroku create getmask-github-license

# Configurar variáveis
heroku config:set GITHUB_TOKEN=seu_token

# Deploy
git push heroku main
```

### **Opção 2: Railway.app**
```bash
# Conectar repositório GitHub
# Configurar variável GITHUB_TOKEN
# Deploy automático
```

### **Opção 3: Render.com**
```bash
# Conectar repositório GitHub
# Configurar variável GITHUB_TOKEN
# Deploy automático
```

---

## 📱 **Interface Web:**

### **GitHub Pages:**
1. Fazer upload do `github-license-interface.html` para o repositório
2. Ativar GitHub Pages nas configurações
3. URL: `https://ghostsck-dev.github.io/getmask-licenses/`

### **Funcionalidades:**
- ✅ **CRUD completo** de empresas
- ✅ **Validação de licenças** em tempo real
- ✅ **Estatísticas** de licenças
- ✅ **Interface responsiva** e moderna
- ✅ **Exportação** de dados
- ✅ **Persistência** automática no GitHub

---

## 🔌 **API Endpoints:**

### **GET /api/companies**
- Retorna lista de todas as empresas licenciadas

### **POST /api/companies**
- Adiciona nova empresa
- Body: `{ name, nagiosUrl, expires, licenseType }`

### **DELETE /api/companies/:key**
- Remove empresa pelo ID

### **POST /api/license/check**
- Valida licença para empresa/Nagios
- Body: `{ company, nagios_url }`

---

## 📱 **Integração GetMask:**

### **URL da API:**
```dart
// mascara_olt/lib/main.dart
static const String _baseUrl = 'https://getmask-github-license.herokuapp.com';
```

### **Validação de Licença:**
```dart
final result = await LicenseManager.validateLicense(companyName, nagiosUrl);
if (result['has_license']) {
    // Licença válida - permitir uso
} else {
    // Licença inválida - bloquear app
}
```

---

## 🔒 **Segurança:**

### **GitHub Token:**
- Token de acesso pessoal com permissões mínimas
- Armazenado como variável de ambiente
- Nunca commitado no código

### **Validação:**
- Validação de empresa + URL do Nagios
- Verificação de expiração
- Status ativo/inativo

---

## 📊 **Vantagens da Nova Arquitetura:**

### **✅ Confiabilidade:**
- GitHub é 99.9% uptime
- Sem problemas de deployment protection
- Backup automático no Git

### **✅ Simplicidade:**
- Um único servidor Node.js
- Interface web estática
- Sem complexidade de sincronização

### **✅ Escalabilidade:**
- GitHub suporta milhares de empresas
- API REST padrão
- Fácil integração

### **✅ Manutenção:**
- Código limpo e organizado
- Logs detalhados
- Debugging simples

---

## 🚀 **Próximos Passos:**

1. **Deploy do servidor** no Heroku/Railway
2. **Configurar GitHub Pages** para interface
3. **Testar integração** com GetMask
4. **Migrar dados** existentes (se necessário)

---

## 📞 **Suporte:**

- **Desenvolvedor**: Patrick Braga
- **Instagram**: @patricksck
- **GitHub**: ghostsck
- **Email**: patrickgold02@outlook.com

---

## 📝 **Changelog:**

### **v2.0.0** - Nova Arquitetura GitHub
- ✅ Removido sistema Netlify/Vercel
- ✅ Implementado GitHub API como banco de dados
- ✅ Interface web moderna e responsiva
- ✅ Servidor Node.js simplificado
- ✅ Deploy automático via Heroku/Railway
- ✅ Backup automático no GitHub

### **v1.x.x** - Arquitetura Anterior
- ❌ Sistema Netlify Functions (removido)
- ❌ Sistema Vercel API (removido)
- ❌ Sincronização complexa (removido)
- ❌ Problemas de deployment protection (resolvido)

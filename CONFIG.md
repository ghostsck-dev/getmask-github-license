# 🔧 Configuração GetMask License System

## 📋 **Variáveis de Ambiente Necessárias:**

```bash
# GitHub Token (OBRIGATÓRIO)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Porta do servidor (opcional, padrão: 3000)
export PORT=3000

# Modo de desenvolvimento (opcional)
export NODE_ENV="development"
```

## 🔑 **Como Obter o GitHub Token:**

1. **Acesse**: https://github.com/settings/tokens
2. **Clique em**: "Generate new token" > "Generate new token (classic)"
3. **Nome**: `GetMask License System`
4. **Expiração**: `No expiration` (ou conforme necessário)
5. **Permissões**: Marque `repo` (acesso completo ao repositório)
6. **Clique em**: "Generate token"
7. **Copie o token** e configure como variável de ambiente

## 🏗️ **Estrutura do Repositório GitHub:**

```
getmask-licenses/
├── api/
│   └── licenses.json          # Arquivo de licenças (criado automaticamente)
├── github-license-interface.html  # Interface web
└── README.md
```

## 📱 **URLs de Acesso:**

### **Servidor API:**
- **Local**: `http://localhost:3000`
- **Heroku**: `https://getmask-github-license.herokuapp.com`
- **Railway**: `https://getmask-github-license.railway.app`
- **Render**: `https://getmask-github-license.onrender.com`

### **Interface Web:**
- **GitHub Pages**: `https://ghostsck-dev.github.io/getmask-licenses/`

## 🔌 **Endpoints da API:**

### **Listar Empresas:**
```bash
curl https://seu-app.herokuapp.com/api/companies
```

### **Adicionar Empresa:**
```bash
curl -X POST https://seu-app.herokuapp.com/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Telecom ABC",
    "nagiosUrl": "192.168.1.100",
    "expires": "2025-12-31",
    "licenseType": "Licença Corporativa"
  }'
```

### **Validar Licença:**
```bash
curl -X POST https://seu-app.herokuapp.com/api/license/check \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Telecom ABC",
    "nagios_url": "192.168.1.100"
  }'
```

### **Remover Empresa:**
```bash
curl -X DELETE https://seu-app.herokuapp.com/api/companies/1234567890
```

## 🧪 **Teste de Funcionamento:**

### **1. Testar Servidor:**
```bash
# Iniciar servidor
node github-license-server.js

# Em outro terminal, testar
curl http://localhost:3000/api/companies
```

### **2. Testar Interface Web:**
```bash
# Abrir interface
open github-license-interface.html

# Ou servir via HTTP
python -m http.server 8000
# Acessar: http://localhost:8000/github-license-interface.html
```

## 🚀 **Deploy Automático:**

### **Heroku:**
```bash
# Instalar Heroku CLI
# Login
heroku login

# Criar app
heroku create getmask-github-license

# Configurar token
heroku config:set GITHUB_TOKEN=$GITHUB_TOKEN

# Deploy
git add .
git commit -m "Deploy GetMask License System"
git push heroku main
```

### **Railway:**
1. Acesse: https://railway.app
2. Conecte repositório GitHub
3. Configure variável `GITHUB_TOKEN`
4. Deploy automático

### **Render:**
1. Acesse: https://render.com
2. Conecte repositório GitHub
3. Configure variável `GITHUB_TOKEN`
4. Deploy automático

## 🔒 **Segurança:**

### **GitHub Token:**
- ✅ Nunca commite o token no código
- ✅ Use variáveis de ambiente
- ✅ Token com permissões mínimas necessárias
- ✅ Renove periodicamente

### **API:**
- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ Rate limiting (implementar se necessário)
- ✅ Logs de auditoria

## 📊 **Monitoramento:**

### **Logs do Servidor:**
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# Render
# Logs disponíveis no dashboard
```

### **Métricas:**
- ✅ Uptime do servidor
- ✅ Tempo de resposta da API
- ✅ Número de validações de licença
- ✅ Erros e exceções

## 🆘 **Troubleshooting:**

### **Erro: "GitHub API error: 401"**
- Verificar se o token está correto
- Verificar se o token tem permissões adequadas
- Verificar se o token não expirou

### **Erro: "GitHub API error: 404"**
- Verificar se o repositório existe
- Verificar se o arquivo `api/licenses.json` existe
- Verificar se o token tem acesso ao repositório

### **Erro: "Failed to fetch"**
- Verificar se o servidor está rodando
- Verificar se a URL está correta
- Verificar CORS (se necessário)

### **Erro: "Cannot find module"**
- Executar `npm install`
- Verificar se todas as dependências estão instaladas
- Verificar se o Node.js está atualizado

## 📞 **Suporte:**

- **Desenvolvedor**: Patrick Braga
- **Instagram**: @patricksck
- **GitHub**: ghostsck
- **Email**: patrickgold02@outlook.com

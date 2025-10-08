# 🚀 Guia de Deploy GetMask License System

## 📋 **Deploy Manual - Passo a Passo**

### **1. Criar Repositório GitHub** ⭐ **OBRIGATÓRIO**

1. **Acesse**: https://github.com/new
2. **Nome**: `getmask-github-license`
3. **Descrição**: `GetMask License System using GitHub API`
4. **Visibilidade**: Public
5. **Initialize**: ✅ Add README file
6. **Clique**: "Create repository"

### **2. Fazer Upload dos Arquivos**

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/ghostsck-dev/getmask-github-license.git
   cd getmask-github-license
   ```

2. **Copie os arquivos** do diretório `mascara_olt/server/`:
   - `github-license-server.js`
   - `package.json`
   - `Procfile`
   - `README.md`
   - `CONFIG.md`

3. **Commit e push**:
   ```bash
   git add .
   git commit -m "Add GetMask License System"
   git push origin main
   ```

### **3. Deploy no Heroku** ⭐ **RECOMENDADO**

1. **Acesse**: https://dashboard.heroku.com/new
2. **Nome do app**: `getmask-github-license`
3. **Conecte GitHub**: Selecione o repositório
4. **Deploy**: Clique em "Deploy branch"
5. **Configurar variáveis**:
   - `GITHUB_TOKEN`: Seu token GitHub
   - `NODE_ENV`: `production`

### **4. Deploy no Railway.app** 🚂 **ALTERNATIVA**

1. **Acesse**: https://railway.app
2. **Login**: Com GitHub
3. **New Project**: Deploy from GitHub repo
4. **Selecione**: `getmask-github-license`
5. **Configurar variáveis**:
   - `GITHUB_TOKEN`: Seu token GitHub

### **5. Deploy no Render.com** 🎨 **ALTERNATIVA**

1. **Acesse**: https://render.com
2. **Login**: Com GitHub
3. **New Web Service**: Connect GitHub
4. **Selecione**: `getmask-github-license`
5. **Configurações**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Configurar variáveis**:
   - `GITHUB_TOKEN`: Seu token GitHub

---

## 🔑 **Configurar GitHub Token**

### **Criar Token:**
1. **Acesse**: https://github.com/settings/tokens
2. **Generate new token**: Classic
3. **Nome**: `GetMask License System`
4. **Expiração**: `No expiration`
5. **Permissões**: ✅ `repo` (acesso completo)
6. **Generate token**: Copie o token

### **Configurar no Serviço:**
- **Heroku**: Settings > Config Vars > `GITHUB_TOKEN`
- **Railway**: Variables > `GITHUB_TOKEN`
- **Render**: Environment > `GITHUB_TOKEN`

---

## 🧪 **Testar Deploy**

### **1. Verificar Servidor:**
```bash
curl https://seu-app.herokuapp.com/api/companies
```

### **2. Testar Interface:**
- Acesse: `https://seu-app.herokuapp.com`
- Deve mostrar status do servidor

### **3. Testar Validação:**
```bash
curl -X POST https://seu-app.herokuapp.com/api/license/check \
  -H "Content-Type: application/json" \
  -d '{"company": "Wikitelecom", "nagios_url": "172.16.14.178"}'
```

---

## 📱 **Atualizar GetMask App**

### **URL da API:**
```dart
// mascara_olt/lib/main.dart
static const String _baseUrl = 'https://seu-app.herokuapp.com';
```

### **Exemplos de URLs:**
- **Heroku**: `https://getmask-github-license.herokuapp.com`
- **Railway**: `https://getmask-github-license.railway.app`
- **Render**: `https://getmask-github-license.onrender.com`

---

## 🔧 **Troubleshooting**

### **Erro: "Cannot find module"**
- Verificar se `package.json` está correto
- Executar `npm install` localmente

### **Erro: "GitHub API error: 401"**
- Verificar se `GITHUB_TOKEN` está configurado
- Verificar se o token tem permissões `repo`

### **Erro: "GitHub API error: 404"**
- Verificar se o repositório existe
- Verificar se o arquivo `api/licenses.json` existe

### **Erro: "Failed to fetch"**
- Verificar se o servidor está rodando
- Verificar se a URL está correta
- Verificar CORS (se necessário)

---

## 📊 **Status do Deploy**

### **✅ Concluído:**
- ✅ Servidor Node.js criado
- ✅ Interface web criada
- ✅ Documentação completa
- ✅ Scripts de deploy
- ✅ Teste local funcionando

### **🔄 Em Progresso:**
- 🔄 Deploy no Heroku/Railway/Render
- 🔄 Configuração GitHub Token
- 🔄 Teste de integração

### **⏳ Pendente:**
- ⏳ Configurar GitHub Pages para interface
- ⏳ Teste completo com GetMask
- ⏳ Migração de dados existentes

---

## 📞 **Suporte**

- **Desenvolvedor**: Patrick Braga
- **Instagram**: @patricksck
- **GitHub**: ghostsck
- **Email**: patrickgold02@outlook.com

---

## 🎯 **Próximos Passos**

1. **Criar repositório GitHub** ✅
2. **Fazer upload dos arquivos** ✅
3. **Deploy no Heroku/Railway/Render** 🔄
4. **Configurar GitHub Token** ⏳
5. **Testar integração** ⏳
6. **Atualizar GetMask** ⏳

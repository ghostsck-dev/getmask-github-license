# 🚂 Deploy Gratuito no Railway.app

## 🆓 **Railway.app - Alternativa Gratuita ao Heroku**

### **✅ Vantagens:**
- **Gratuito**: 500 horas/mês (suficiente para uso pessoal)
- **Deploy automático**: Via GitHub
- **SSL incluído**: HTTPS automático
- **Banco de dados**: PostgreSQL gratuito
- **Logs**: Em tempo real
- **Domínio**: `.railway.app` incluído

---

## 🚀 **Deploy no Railway.app - Passo a Passo**

### **📋 Passo 1: Criar Conta**
1. **Acesse**: https://railway.app
2. **Sign up**: Com GitHub
3. **Autorize**: Acesso aos repositórios

### **📋 Passo 2: Criar Projeto**
1. **New Project**: Clique no botão
2. **Deploy from GitHub repo**: Selecione
3. **Selecione**: `getmask-github-license` (ou crie primeiro)

### **📋 Passo 3: Criar Repositório GitHub**
1. **Acesse**: https://github.com/new
2. **Repository name**: `getmask-github-license`
3. **Description**: `GetMask License System using GitHub API`
4. **Public** + Initialize with README
5. **Create repository**

### **📋 Passo 4: Upload dos Arquivos**
```bash
# Clone o repositório
git clone https://github.com/ghostsck-dev/getmask-github-license.git
cd getmask-github-license

# Copie TODOS os arquivos de mascara_olt/server/
# (github-license-server.js, package.json, railway.json, etc.)

# Commit e push
git add .
git commit -m "Add GetMask License System"
git push origin main
```

### **📋 Passo 5: Deploy no Railway**
1. **Volte ao Railway**: https://railway.app
2. **New Project**: Deploy from GitHub repo
3. **Selecione**: `getmask-github-license`
4. **Deploy**: Automático!

### **📋 Passo 6: Configurar Variáveis**
1. **No Railway**: Clique no projeto
2. **Variables**: Adicione `GITHUB_TOKEN`
3. **Value**: Seu token GitHub
4. **Save**: As variáveis

---

## 🔑 **Configurar GitHub Token**

### **Criar Token:**
1. **Acesse**: https://github.com/settings/tokens
2. **Generate new token**: Classic
3. **Nome**: `GetMask License System`
4. **Expiração**: `No expiration`
5. **Permissões**: ✅ `repo` (acesso completo)
6. **Generate token**: Copie o token

### **Configurar no Railway:**
1. **Railway Dashboard**: Seu projeto
2. **Variables**: Clique em "New Variable"
3. **Name**: `GITHUB_TOKEN`
4. **Value**: Cole o token
5. **Save**: A variável

---

## 🧪 **Testar Deploy**

### **1. Verificar Status:**
- Railway Dashboard: Deploy status
- Logs: Em tempo real

### **2. Testar API:**
```bash
curl https://getmask-github-license.railway.app/api/companies
```

### **3. Testar Interface:**
- Acesse: `https://getmask-github-license.railway.app`
- Deve mostrar status do servidor

---

## 📱 **Atualizar GetMask**

### **URL da API:**
```dart
// mascara_olt/lib/main.dart
static const String _baseUrl = 'https://getmask-github-license.railway.app';
```

### **URLs Finais:**
- **Railway App**: `https://getmask-github-license.railway.app`
- **API**: `https://getmask-github-license.railway.app/api/companies`
- **Interface**: `https://getmask-github-license.railway.app`

---

## 🔧 **Troubleshooting**

### **Erro: "Build failed"**
- Verificar se `package.json` está correto
- Verificar se todas as dependências estão listadas

### **Erro: "Cannot find module"**
- Verificar se `github-license-server.js` existe
- Verificar se o arquivo está na raiz do projeto

### **Erro: "GitHub API error: 401"**
- Verificar se `GITHUB_TOKEN` está configurado
- Verificar se o token tem permissões `repo`

---

## 📊 **Comparação de Custos**

| Serviço | Gratuito | Pago |
|---------|----------|------|
| **Heroku** | ❌ Removido | $7/mês |
| **Railway** | ✅ 500h/mês | $5/mês |
| **Render** | ✅ 750h/mês | $7/mês |
| **Vercel** | ✅ Sempre | $20/mês |
| **Netlify** | ✅ Sempre | $19/mês |

---

## 🎯 **Próximos Passos**

1. **Criar conta Railway** ✅
2. **Criar repositório GitHub** ⏳
3. **Upload dos arquivos** ⏳
4. **Deploy automático** ⏳
5. **Configurar GitHub Token** ⏳
6. **Testar integração** ⏳

---

## 📞 **Suporte**

- **Desenvolvedor**: Patrick Braga
- **Instagram**: @patricksck
- **GitHub**: ghostsck
- **Email**: patrickgold02@outlook.com

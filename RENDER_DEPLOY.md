# 🎨 GetMask License System - Deploy no Render.com

## 🆓 **Render.com - Plataforma Gratuita e Confiável**

### **✅ Vantagens do Render:**
- **Gratuito**: 750 horas/mês (mais que suficiente)
- **Deploy automático**: Via GitHub
- **SSL incluído**: HTTPS automático
- **Logs em tempo real**: Debugging fácil
- **Domínio**: `.onrender.com` incluído
- **Uptime**: 99.9% garantido
- **Suporte**: Excelente documentação

---

## 🚀 **Deploy no Render.com - Passo a Passo**

### **📋 Passo 1: Criar Conta Render**
1. **Acesse**: https://render.com
2. **Sign up**: Com GitHub
3. **Autorize**: Acesso aos repositórios

### **📋 Passo 2: Criar Repositório GitHub**
1. **Acesse**: https://github.com/new
2. **Repository name**: `getmask-github-license`
3. **Description**: `GetMask License System using GitHub API`
4. **Public** + Initialize with README
5. **Create repository**

### **📋 Passo 3: Upload dos Arquivos**
```bash
# Clone o repositório
git clone https://github.com/ghostsck-dev/getmask-github-license.git
cd getmask-github-license

# Copie TODOS os arquivos de mascara_olt/server/
# (github-license-server.js, package.json, render.yaml, etc.)

# Commit e push
git add .
git commit -m "Add GetMask License System for Render.com"
git push origin main
```

### **📋 Passo 4: Deploy no Render**
1. **Acesse**: https://dashboard.render.com
2. **New +**: Clique no botão
3. **Web Service**: Selecione
4. **Connect GitHub**: Autorize
5. **Selecione**: `getmask-github-license`
6. **Configure**:
   - **Name**: `getmask-github-license`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. **Deploy**: Clique em "Create Web Service"

### **📋 Passo 5: Configurar Variáveis**
1. **No Render**: Seu serviço
2. **Environment**: Clique na aba
3. **Add Environment Variable**:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Seu token GitHub
4. **Save Changes**: Salvar

---

## 🔑 **Configurar GitHub Token**

### **Criar Token:**
1. **Acesse**: https://github.com/settings/tokens
2. **Generate new token**: Classic
3. **Nome**: `GetMask License System`
4. **Expiração**: `No expiration`
5. **Permissões**: ✅ `repo` (acesso completo)
6. **Generate token**: Copie o token

### **Configurar no Render:**
1. **Render Dashboard**: Seu serviço
2. **Environment**: Adicione `GITHUB_TOKEN`
3. **Value**: Cole o token
4. **Save**: A variável

---

## 🧪 **Testar Deploy**

### **1. Verificar Status:**
- Render Dashboard: Deploy status
- Logs: Em tempo real

### **2. Testar API:**
```bash
curl https://getmask-github-license.onrender.com/api/companies
```

### **3. Testar Interface:**
- Acesse: `https://getmask-github-license.onrender.com`
- Deve mostrar status do servidor

---

## 📱 **Atualizar GetMask**

### **URL da API:**
```dart
// mascara_olt/lib/main.dart
static const String _baseUrl = 'https://getmask-github-license.onrender.com';
```

### **URLs Finais:**
- **Render App**: `https://getmask-github-license.onrender.com`
- **API**: `https://getmask-github-license.onrender.com/api/companies`
- **Interface**: `https://getmask-github-license.onrender.com`

---

## 🔧 **Troubleshooting**

### **Erro: "Build failed"**
- Verificar se `package.json` está correto
- Verificar se todas as dependências estão listadas
- Verificar logs no Render Dashboard

### **Erro: "Cannot find module"**
- Verificar se `github-license-server.js` existe
- Verificar se o arquivo está na raiz do projeto
- Verificar se o `main` no `package.json` está correto

### **Erro: "GitHub API error: 401"**
- Verificar se `GITHUB_TOKEN` está configurado
- Verificar se o token tem permissões `repo`
- Verificar se a variável está salva no Render

### **Erro: "Service unavailable"**
- Render pode estar fazendo deploy
- Aguardar alguns minutos
- Verificar logs para mais detalhes

---

## 📊 **Comparação de Plataformas**

| Plataforma | Gratuito | Deploy | SSL | Logs | Suporte |
|-------------|----------|--------|-----|------|---------|
| **Heroku** | ❌ $7/mês | Manual | ✅ | ✅ | ✅ |
| **Railway** | ✅ 500h/mês | Auto | ✅ | ✅ | ✅ |
| **Render** | ✅ 750h/mês | Auto | ✅ | ✅ | ✅ |
| **Vercel** | ✅ Sempre | Auto | ✅ | ✅ | ✅ |
| **Netlify** | ✅ Sempre | Auto | ✅ | ✅ | ✅ |

---

## 🎯 **Próximos Passos**

1. **Criar conta Render** ⏳
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

---

## 🎉 **Por que Render.com?**

### **🚀 Simplicidade:**
- Deploy automático via GitHub
- Configuração mínima
- Interface intuitiva

### **💰 Custo:**
- Plano gratuito generoso
- Sem surpresas na cobrança
- Transparente nos limites

### **🔒 Confiabilidade:**
- 99.9% uptime
- SSL automático
- Backup automático

### **🛠️ Manutenção:**
- Logs em tempo real
- Debugging fácil
- Suporte excelente

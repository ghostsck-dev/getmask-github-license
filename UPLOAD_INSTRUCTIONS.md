# 🚀 Script de Upload para GitHub

## 📋 **Instruções para Upload Manual:**

### **1. Criar Repositório GitHub:**
1. Acesse: https://github.com/new
2. Repository name: `getmask-github-license`
3. Description: `GetMask License System using GitHub API`
4. Public + Initialize with README
5. Create repository

### **2. Upload dos Arquivos:**
Após criar o repositório, execute estes comandos:

```bash
# Clone o repositório vazio
git clone https://github.com/ghostsck-dev/getmask-github-license.git
cd getmask-github-license

# Copie os arquivos do diretório atual
# (Copie todos os arquivos de mascara_olt/server/ para este diretório)

# Adicione e faça commit
git add .
git commit -m "Add GetMask License System"
git push origin main
```

### **3. Arquivos Necessários:**
Certifique-se de copiar estes arquivos:
- ✅ `github-license-server.js`
- ✅ `package.json`
- ✅ `Procfile`
- ✅ `app.json`
- ✅ `README.md`
- ✅ `CONFIG.md`
- ✅ `DEPLOY_GUIDE.md`

### **4. Deploy no Heroku:**
Após o upload no GitHub:
1. Volte ao Heroku: https://dashboard.heroku.com/new
2. Conecte com o repositório GitHub
3. Deploy branch
4. Configure `GITHUB_TOKEN` nas Config Vars

### **5. Configurar GitHub Token:**
1. Acesse: https://github.com/settings/tokens
2. Generate new token (classic)
3. Permissões: ✅ `repo`
4. Copie o token
5. No Heroku: Settings > Config Vars > `GITHUB_TOKEN`

---

## 🎯 **URLs Finais:**

- **Heroku App**: `https://getmask-github-license.herokuapp.com`
- **GitHub Repo**: `https://github.com/ghostsck-dev/getmask-github-license`
- **API Endpoint**: `https://getmask-github-license.herokuapp.com/api/companies`

---

## 📱 **Atualizar GetMask:**

```dart
// mascara_olt/lib/main.dart
static const String _baseUrl = 'https://getmask-github-license.herokuapp.com';
```

# 🚀 Deploy GetMask no Render.com - Passo a Passo

## ✅ **Status Atual:**
- ✅ Conta Render.com criada
- ✅ GitHub conectado ao Render
- 🔄 Criando repositório GitHub
- ⏳ Upload dos arquivos
- ⏳ Deploy no Render

---

## 📋 **Passo 2: Criar Repositório GitHub**

### **Opção A: Manual (Recomendado)**
1. **Acesse**: https://github.com/new
2. **Repository name**: `getmask-github-license`
3. **Description**: `GetMask License System using GitHub API`
4. **Public** ✅
5. **Initialize this repository with**:
   - ✅ Add a README file
   - ✅ Add .gitignore (Node)
6. **Create repository**

### **Opção B: Automático (Se tiver GitHub Token)**
```bash
# Configure o token primeiro
export GITHUB_TOKEN=seu_token_aqui

# Execute o script
node create-github-repo.js
```

---

## 📋 **Passo 3: Upload dos Arquivos**

### **Método 1: Upload Manual**
```bash
# Clone o repositório
git clone https://github.com/ghostsck-dev/getmask-github-license.git
cd getmask-github-license

# Copie TODOS os arquivos de mascara_olt/server/
# (Arraste e solte ou copie manualmente)

# Commit e push
git add .
git commit -m "Add GetMask License System for Render.com"
git push origin main
```

### **Método 2: Upload Automático**
```bash
# Execute o script de upload
node upload-to-github.js
```

---

## 📋 **Passo 4: Deploy no Render.com**

### **4.1 Criar Web Service**
1. **Acesse**: https://dashboard.render.com
2. **New +**: Clique no botão azul
3. **Web Service**: Selecione

### **4.2 Conectar GitHub**
1. **Connect GitHub**: Clique no botão
2. **Autorize**: Render a acessar seus repositórios
3. **Selecione**: `getmask-github-license`

### **4.3 Configurar Serviço**
- **Name**: `getmask-github-license`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: (deixe vazio)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **4.4 Deploy**
1. **Create Web Service**: Clique no botão
2. **Aguarde**: O deploy automático (2-3 minutos)
3. **Verifique**: Logs em tempo real

---

## 📋 **Passo 5: Configurar GitHub Token**

### **5.1 Criar Token GitHub**
1. **Acesse**: https://github.com/settings/tokens
2. **Generate new token**: Classic
3. **Nome**: `GetMask License System`
4. **Expiração**: `No expiration`
5. **Permissões**: ✅ `repo` (acesso completo)
6. **Generate token**: Copie o token

### **5.2 Configurar no Render**
1. **Render Dashboard**: Seu serviço
2. **Environment**: Clique na aba
3. **Add Environment Variable**:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Cole o token
4. **Save Changes**: Salvar

### **5.3 Reiniciar Serviço**
1. **Manual Deploy**: Clique no botão
2. **Deploy latest commit**: Confirme
3. **Aguarde**: Reinicialização

---

## 🧪 **Passo 6: Testar Deploy**

### **6.1 Verificar Status**
- **Render Dashboard**: Status "Live"
- **Logs**: Sem erros
- **URL**: Funcionando

### **6.2 Testar API**
```bash
# Testar endpoint principal
curl https://getmask-github-license.onrender.com/api/companies

# Resposta esperada:
# {"companies": [...]}
```

### **6.3 Testar Interface**
- **Acesse**: `https://getmask-github-license.onrender.com`
- **Deve mostrar**: Status do servidor
- **Deve funcionar**: Interface web

---

## 📱 **Passo 7: Atualizar GetMask**

### **7.1 Atualizar URL**
```dart
// mascara_olt/lib/main.dart
class LicenseManager {
  static const String _baseUrl = 'https://getmask-github-license.onrender.com';
  
  static String get _licenseServer => '$_baseUrl/api/license';
}
```

### **7.2 Testar Integração**
1. **Execute**: `flutter run -d windows`
2. **Configure**: Nagios
3. **Teste**: Validação de licença
4. **Verifique**: Funcionamento

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

## 🎯 **URLs Finais**

- **Render App**: `https://getmask-github-license.onrender.com`
- **API**: `https://getmask-github-license.onrender.com/api/companies`
- **Interface**: `https://getmask-github-license.onrender.com`
- **GitHub**: `https://github.com/ghostsck-dev/getmask-github-license`

---

## 📞 **Suporte**

- **Desenvolvedor**: Patrick Braga
- **Instagram**: @patricksck
- **GitHub**: ghostsck
- **Email**: patrickgold02@outlook.com

---

## 🎉 **Próximos Passos**

1. **Criar repositório GitHub** ⏳
2. **Upload dos arquivos** ⏳
3. **Deploy no Render** ⏳
4. **Configurar GitHub Token** ⏳
5. **Testar integração** ⏳
6. **Atualizar GetMask** ⏳

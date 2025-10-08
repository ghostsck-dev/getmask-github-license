# 🎭 GetMask License System

Sistema de licenciamento para o aplicativo GetMask, desenvolvido para gerenciar licenças de empresas que utilizam o Nagios para monitoramento de serviços.

## 🚀 **Deploy no Render.com**

### **✅ Vantagens do Render:**
- **Gratuito**: 750 horas/mês
- **Deploy automático**: Via GitHub
- **SSL incluído**: HTTPS automático
- **Logs em tempo real**: Debugging fácil
- **Uptime**: 99.9% garantido

### **📋 Deploy Rápido:**

1. **Criar conta**: https://render.com
2. **Criar repositório**: https://github.com/new
   - Nome: `getmask-github-license`
   - Public + Initialize with README
3. **Upload arquivos**: Copie todos os arquivos deste diretório
4. **Deploy**: Connect GitHub no Render
5. **Configurar**: Adicione `GITHUB_TOKEN`

### **🔗 URLs Finais:**
- **App**: `https://getmask-github-license.onrender.com`
- **API**: `https://getmask-github-license.onrender.com/api/companies`
- **Interface**: `https://getmask-github-license.onrender.com`

---

## 📁 **Arquivos Principais**

- `github-license-server.js` - Servidor principal Node.js
- `package.json` - Dependências e configurações
- `render.yaml` - Configuração específica do Render
- `RENDER_DEPLOY.md` - Guia completo de deploy
- `README.md` - Esta documentação

---

## 🔧 **Configuração**

### **Variáveis de Ambiente:**
- `GITHUB_TOKEN` - Token GitHub com permissões `repo`
- `PORT` - Porta do servidor (automática no Render)

### **GitHub Token:**
1. Acesse: https://github.com/settings/tokens
2. Generate new token (classic)
3. Permissões: ✅ `repo` (acesso completo)
4. Copie e configure no Render

---

## 🧪 **Teste Local**

```bash
# Instalar dependências
npm install

# Executar servidor
npm start

# Testar API
curl http://localhost:3000/api/companies
```

---

## 📱 **Integração GetMask**

```dart
// mascara_olt/lib/main.dart
static const String _baseUrl = 'https://getmask-github-license.onrender.com';
```

---

## 🔌 **API Endpoints**

- `GET /api/companies` - Listar empresas licenciadas
- `POST /api/companies` - Adicionar nova empresa
- `DELETE /api/companies/:key` - Remover empresa
- `POST /api/license/check` - Validar licença

---

## 📊 **Funcionalidades**

### **✅ Implementado:**
- Sistema de licenças baseado em GitHub
- Interface web para gerenciamento
- API REST completa
- Validação automática de licenças
- Deploy automático via GitHub
- SSL/HTTPS automático
- Logs em tempo real

### **🔄 Em Desenvolvimento:**
- Interface de gerenciamento web
- Sistema de notificações
- Backup automático
- Métricas de uso

---

## 🛠️ **Tecnologias**

- **Backend**: Node.js + Express
- **Frontend**: HTML + CSS + JavaScript
- **Banco de Dados**: GitHub API (JSON)
- **Deploy**: Render.com
- **SSL**: Automático
- **Logs**: Render Dashboard

---

## 📞 **Suporte**

- **Desenvolvedor**: Patrick Braga
- **Instagram**: @patricksck
- **GitHub**: ghostsck
- **Email**: patrickgold02@outlook.com

---

## 📄 **Licença**

MIT License - Veja o arquivo LICENSE para detalhes.

---

## 🎯 **Status do Projeto**

- ✅ **Servidor Node.js**: Funcionando
- ✅ **API REST**: Implementada
- ✅ **Sistema de Licenças**: Funcionando
- ✅ **Deploy Render**: Configurado
- ✅ **Documentação**: Completa
- 🔄 **Testes**: Em andamento
- ⏳ **Produção**: Pronto para deploy
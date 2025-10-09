console.log('🔧 GUIA COMPLETO DE CONFIGURAÇÃO\n');

console.log('📋 PASSO 1: CONFIGURAR MONGODB ATLAS');
console.log('1. Acesse: https://cloud.mongodb.com/');
console.log('2. Faça login na sua conta');
console.log('3. Vá para: Network Access (no menu lateral)');
console.log('4. Clique em: "Add IP Address"');
console.log('5. Adicione: 0.0.0.0/0');
console.log('6. Descrição: "Permitir Vercel e todos os IPs"');
console.log('7. Clique em: "Confirm"');
console.log('8. Aguarde alguns minutos para propagação');
console.log('');

console.log('📋 PASSO 2: VERIFICAR ENVIRONMENT VARIABLES NO VERCEL');
console.log('1. Acesse: https://vercel.com/dashboard');
console.log('2. Encontre seu projeto: getmask');
console.log('3. Vá para: Settings → Environment Variables');
console.log('4. Confirme se existe:');
console.log('   - MONGODB_URI = mongodb+srv://ghostsck:1502%40Ghost0@clustermsk.rz7l7ke.mongodb.net/getmask-licenses?retryWrites=true&w=majority&appName=ClusterMsk');
console.log('   - ADMIN_KEY = getmask-admin-2025');
console.log('   - NODE_ENV = production');
console.log('');

console.log('📋 PASSO 3: REDEPLOY NO VERCEL');
console.log('1. Após configurar MongoDB Atlas');
console.log('2. Vá para: Deployments');
console.log('3. Clique em: "Redeploy" no último deploy');
console.log('4. Aguarde o deploy concluir');
console.log('');

console.log('📋 PASSO 4: TESTAR SEGURANÇA');
console.log('1. Acesse: https://getmask.vercel.app/');
console.log('2. Deve mostrar as empresas cadastradas');
console.log('3. APIs administrativas devem ser bloqueadas para outros IPs');
console.log('4. APIs de licença devem funcionar para todos');
console.log('');

console.log('🔒 CONFIGURAÇÃO DE SEGURANÇA ATUAL:');
console.log('✅ Apenas IP 45.181.228.226 pode gerenciar empresas');
console.log('✅ APIs de licença livres para clientes');
console.log('✅ MongoDB Atlas acessível pelo Vercel');
console.log('');

console.log('⚠️ IMPORTANTE:');
console.log('- MongoDB Atlas deve permitir 0.0.0.0/0 para funcionar');
console.log('- Environment Variables devem estar configuradas no Vercel');
console.log('- Redeploy necessário após mudanças');
console.log('');

console.log('🎯 RESULTADO ESPERADO:');
console.log('- Site funcionando: https://getmask.vercel.app/');
console.log('- Empresas aparecendo na interface');
console.log('- Apenas seu IP pode gerenciar empresas');
console.log('- Clientes podem validar licenças');

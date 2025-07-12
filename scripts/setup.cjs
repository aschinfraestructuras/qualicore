const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando setup completo do Qualicore...\n');

try {
  // Step 1: Create admin
  console.log('📋 Passo 1: Criando administrador...');
  execSync('node scripts/create-admin.cjs', { stdio: 'inherit' });
  console.log('✅ Administrador criado/verificado!\n');
  
  // Step 2: Setup collections and demo data
  console.log('📋 Passo 2: Criando coleções e dados de demonstração...');
  execSync('node scripts/setup-pocketbase.cjs', { stdio: 'inherit' });
  console.log('✅ Coleções e dados criados!\n');
  
  console.log('🎉 Setup completo concluído com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Inicie o servidor de desenvolvimento: npm run dev');
  console.log('   2. Aceda à aplicação: http://localhost:3000');
  console.log('   3. Faça login com as credenciais mock ou crie uma conta');
  console.log('\n🔗 PocketBase Admin: http://127.0.0.1:8090/_/');
  console.log('📧 Admin Email: admin@qualicore.pt');
  console.log('🔑 Admin Password: admin123');
  
} catch (error) {
  console.error('❌ Erro durante o setup:', error.message);
  process.exit(1);
} 
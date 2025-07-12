const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setup Simples do Qualicore\n');

// Check if PocketBase executable exists
const pocketbasePath = path.join(__dirname, '..', 'pocketbase.exe');
if (!fs.existsSync(pocketbasePath)) {
  console.error('❌ PocketBase não encontrado!');
  console.log('💡 Por favor:');
  console.log('   1. Baixe o PocketBase de https://pocketbase.io/');
  console.log('   2. Coloque o pocketbase.exe na pasta raiz do projeto');
  process.exit(1);
}

console.log('✅ PocketBase encontrado');

// Start PocketBase in background
console.log('\n🔧 Iniciando PocketBase...');
const pocketbase = spawn(pocketbasePath, ['serve'], {
  stdio: 'pipe',
  detached: true
});

// Wait a bit for PocketBase to start
setTimeout(async () => {
  try {
    console.log('⏳ Aguardando PocketBase inicializar...');
    
    // Wait for PocketBase to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n📋 PocketBase está pronto!');
    console.log('🔗 URL: http://127.0.0.1:8090');
    console.log('🔗 Admin: http://127.0.0.1:8090/_/');
    
    console.log('\n📝 Próximos passos:');
    console.log('1. Abra http://127.0.0.1:8090/_/ no navegador');
    console.log('2. Crie uma conta de administrador');
    console.log('3. Use as seguintes credenciais sugeridas:');
    console.log('   Email: admin@qualicore.pt');
    console.log('   Password: admin123');
    console.log('4. Depois execute: npm run setup-collections');
    
    console.log('\n🎯 Para iniciar a aplicação:');
    console.log('   npm run dev');
    
    console.log('\n💡 Dica: Mantenha o PocketBase a correr em segundo plano');
    console.log('   Para parar: Ctrl+C neste terminal');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}, 1000);

// Handle process exit
process.on('SIGINT', () => {
  console.log('\n🛑 Parando PocketBase...');
  pocketbase.kill();
  process.exit(0);
}); 
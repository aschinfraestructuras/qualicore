const PocketBase = require('pocketbase');

// Configuration
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'sitecore.quality@gmail.com';
const ADMIN_PASSWORD = 'Hercules2.1';

async function createAdmin() {
  const pb = new PocketBase(POCKETBASE_URL);
  
  try {
    console.log('🔗 Conectando ao PocketBase...');
    
    // Try to authenticate first
    try {
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ Admin já existe e autenticação bem-sucedida!');
      return;
    } catch (error) {
      // Admin doesn't exist or wrong credentials, continue to create
    }
    
    // Create admin
    console.log('👤 Criando administrador...');
    await pb.admins.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      passwordConfirm: ADMIN_PASSWORD
    });
    
    console.log('✅ Administrador criado com sucesso!');
    console.log('\n📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('\n🔗 URL do PocketBase Admin:', `${POCKETBASE_URL}/_/`);
    
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('\n💡 Certifique-se de que:');
      console.log('   1. O PocketBase está a correr em', POCKETBASE_URL);
      console.log('   2. O servidor está acessível');
      console.log('   3. Não há firewall a bloquear a conexão');
    }
    
    if (error.message.includes('already exists')) {
      console.log('\n💡 O administrador já existe. Tente fazer login com as credenciais:');
      console.log('   Email:', ADMIN_EMAIL);
      console.log('   Password:', ADMIN_PASSWORD);
    }
  }
}

// Run the script
createAdmin(); 
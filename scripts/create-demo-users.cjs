const PocketBase = require('pocketbase').default

const POCKETBASE_URL = 'https://qualicore-pocketbase.onrender.com'
const ADMIN_EMAIL = 'sitecore.quality@gmail.com'
const ADMIN_PASSWORD = 'Hercules2.1'

const demoUsers = [
  {
    email: 'admin@qualicore.pt',
    password: 'admin123',
    passwordConfirm: 'admin123',
    nome: 'Admin',
    perfil: 'qualidade',
    username: 'admin'
  },
  {
    email: 'qualidade@qualicore.pt',
    password: 'qualidade123',
    passwordConfirm: 'qualidade123',
    nome: 'Qualidade',
    perfil: 'qualidade',
    username: 'qualidade'
  },
  {
    email: 'producao@qualicore.pt',
    password: 'producao123',
    passwordConfirm: 'producao123',
    nome: 'Produção',
    perfil: 'producao',
    username: 'producao'
  }
]

async function createDemoUsers() {
  const pb = new PocketBase(POCKETBASE_URL)
  try {
    console.log('🔐 A fazer login como admin...')
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ Login bem-sucedido!')
    for (const user of demoUsers) {
      try {
        await pb.collection('users').create(user)
        console.log(`✅ Utilizador ${user.email} criado!`)
      } catch (error) {
        console.log(`ℹ️ Utilizador ${user.email} já existe ou erro:`, error.message)
      }
    }
    console.log('🎉 Utilizadores demo criados!')
  } catch (error) {
    console.error('❌ Erro ao criar utilizadores demo:', error)
  }
}

createDemoUsers() 